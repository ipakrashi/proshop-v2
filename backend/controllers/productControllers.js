import asyncHandler from 'express-async-handler'
import productModel from '../models/productModel.js'
// @desc            Fetch All Products
//  route             GET /api/products/
//  @access         Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await productModel.find({})

    if (!products) {
        return res.status(500).json({ message: error.message })
    } else {
        return res.status(200).json(products)
    }
})

// @desc            Fetch Products By Id
//  route             GET /api/products/:id
//  @access         Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await productModel.findById(req.params.id)

    if (!product) {
        res.status(404)
        throw new Error('Resource not found')
    } else {
        return res.status(200).json(product)
    }
})

// @desc            Create a Product
//  route             POST /api/products/
//  @access         Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new productModel({
        name: 'Sample Name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample Brand',
        category: 'Sample Category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample Description',
    })
    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

export { getProducts, getProductById, createProduct }
