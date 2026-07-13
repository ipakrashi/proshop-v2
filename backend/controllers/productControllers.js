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

export { getProducts, getProductById }
