import asyncHandler from 'express-async-handler'
import orderModel from '../models/orderModel.js'

// @desc       Create New Order
//  route        POST api/orders
//  @access    Private
const addOrderItems = asyncHandler(async (req, res) => {
    // Get Reqd Items from the body
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body

    // If there are no Orders
    if (!orderItems || orderItems.length === 0) {
        res.status(400)
        throw new Error('No Order Items')
    }
    const order = new orderModel({
        orderItems: orderItems.map((item) => {
            const { _id, ...rest } = item
            return {
                ...rest,
                product: _id,
            }
        }),
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    })

    const createOrder = await order.save()
    res.status(201).json({ createOrder, message: `Order Created` })
})

// @desc       Get Logged In user Orders
//  route        GET api/orders/myorders
//  @access    Private
const getMyOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const orders = await orderModel.find({ user: _id })
    res.status(200).json(orders)
})

// @desc       Get Order By Id
//  route        GET api/orders/:id
//  @access    Private/Admin
const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params
    const order = await orderModel.findById(id).populate('user', 'name email')
    if (order) {
        res.status(200).json({
            order,
            message: `Order Details for Order No: ${id}`,
        })
    } else {
        res.status(404)
        throw new Error('Order Not Found')
    }
})

// @desc       Update Order To Paid
//  route        PUT api/orders/:id/pay
//  @access    Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const { id } = req.params
    const order = await orderModel.findById(id)
    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer?.email_address,
        }

        const updatedOrder = await order.save()
        res.status(200).json({
            updatedOrder,
        })
    } else {
        res.status(404)
        throw new Error('Order Not Found')
    }
})

// @desc       Update Order To Delivered
//  route        PUT api/orders/:id/deliver
//  @access    Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const { id } = req.params
    const order = await orderModel.findById(id)
    if (order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()

        const updatedOrder = await order.save()
        res.status(200).json({
            updatedOrder,
            message: `Delivery status updated for Order ${id}`,
        })
    } else {
        res.status(404)
        throw new Error('Order Not Found')
    }
})

// @desc       Get All Orders
//  route        GET api/orders
// @access    Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await orderModel.find({}).populate('user', 'name email')
    res.status(200).json(orders)
})

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders,
}
