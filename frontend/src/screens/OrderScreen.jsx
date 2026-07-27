import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
    useDeliverOrderMutation,
    useGetOrderDetailsQuery,
    useGetPayPalClientIdQuery,
    usePayOrderMutation,
} from '../slices/ordersApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { useSelector } from 'react-redux'

const OrderScreen = () => {
    const { id: orderId } = useParams()

    const {
        data: order,
        isLoading,
        refetch,
        error,
    } = useGetOrderDetailsQuery(orderId)

    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation()

    const { userInfo } = useSelector((state) => state.authR)

    const [deliverOrder, { isLoading: loadingDeliver }] =
        useDeliverOrderMutation()

    const [{ isPending, options }, paypalDispatch] = usePayPalScriptReducer()

    const {
        data: paypal,
        isLoading: loadingPaypal,
        error: errorPaypal,
    } = useGetPayPalClientIdQuery()

    useEffect(() => {
        if (!errorPaypal && !loadingPaypal && paypal?.clientId) {
            if (order && !order.isPaid) {
                // Only reset options if client-id isn't already set to prevent re-initialization mid-session
                if (options['client-id'] !== paypal.clientId) {
                    paypalDispatch({
                        type: 'resetOptions',
                        value: {
                            'client-id': paypal.clientId,
                            currency: 'USD',
                        },
                    })
                    paypalDispatch({
                        type: 'setLoadingStatus',
                        value: 'pending',
                    })
                }
            }
        }
    }, [order, paypal, paypalDispatch, loadingPaypal, errorPaypal, options])

    async function onApproveTest() {
        await payOrder({ orderId, details: { payer: {} } })
        refetch()
        toast.success('Payment Successful')
    }

    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                await payOrder({ orderId, details })
                refetch()
                toast.success('Payment Successful')
            } catch (err) {
                toast.error(err?.data?.message || err?.message || err)
            }
        })
    }

    function onError(err) {
        toast.error(err?.message || 'PayPal payment error occurred')
    }

    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice,
                    },
                },
            ],
        })
    }

    const deliverOrderHandler = async () => {
        try {
            await deliverOrder(orderId)
            refetch()
            toast.success('Order Delivered')
        } catch (error) {
            toast.error(error?.data.message || error.message)
        }
    }

    return isLoading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger'>
            {error?.data?.message || error.error}
        </Message>
    ) : (
        <>
            <h1>Order: {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name: </strong> {order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong> {order.user.email}
                            </p>
                            <div>
                                <strong>Address: </strong>
                                <div>
                                    {order.shippingAddress.address}
                                    <br />
                                    {order.shippingAddress.city}{' '}
                                    {order.shippingAddress.postalCode}
                                    <br />
                                    {order.shippingAddress.country}
                                </div>
                            </div>
                            <div className='mt-2'>
                                {order.isDelivered ? (
                                    <Message variant='success'>
                                        Delivered On: {order.deliveredAt}
                                    </Message>
                                ) : (
                                    <Message variant='danger'>
                                        Not Delivered
                                    </Message>
                                )}
                            </div>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <Message variant='success'>
                                    Paid On: {order.paidAt}
                                </Message>
                            ) : (
                                <Message variant='danger'>Not Paid</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.map((item, index) => (
                                <ListGroup.Item key={index}>
                                    <Row>
                                        <Col md={1}>
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fluid
                                                rounded
                                            />
                                        </Col>
                                        <Col>
                                            <Link to={`/product/${item._id}`}>
                                                {item.name}
                                            </Link>
                                        </Col>
                                        <Col md={4}>
                                            {item.qty} x ${item.price} = $
                                            {(item.qty * item.price).toFixed(2)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {isPending ? (
                                        <Loader />
                                    ) : (
                                        <div>
                                            <Button
                                                onClick={onApproveTest}
                                                className='btn-block mb-2'
                                                style={{ width: '100%' }}
                                            >
                                                Test Pay Order
                                            </Button>
                                            <div>
                                                <PayPalButtons
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </ListGroup.Item>
                            )}
                            {loadingDeliver && <Loader />}
                            {userInfo &&
                                userInfo.isAdmin &&
                                order.isPaid &&
                                !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button
                                            type='button'
                                            className='btn btn-block'
                                            onClick={deliverOrderHandler}
                                        >
                                            Mark As Deivered
                                        </Button>
                                    </ListGroup.Item>
                                )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default OrderScreen
