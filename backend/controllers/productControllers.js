import asyncHandler from 'express-async-handler'
import productModel from '../models/productModel.js'

// @desc            Fetch All Products
//  route             GET /api/products/
//  @access         Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = process.env.PAGINATION_LIMIT
    const page = Number(req.query.pageNumber) || 1
    const keyword = req.query.keyword
        ? { name: { $regex: req.query.keyword, $options: 'i' } }
        : {}
    const count = await productModel.countDocuments({ ...keyword })

    const products = await productModel
        .find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1))

    if (!products) {
        return res.status(500).json({ message: error.message })
    } else {
        return res
            .status(200)
            .json({ products, page, pages: Math.ceil(count / pageSize) })
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

// @desc            Update A Product
//  route             PUT /api/products/:id
//  @access         Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } =
        req.body
    const product = await productModel.findById(req.params.id)

    if (product) {
        product.name = name || product.name
        product.price = price !== undefined ? price : product.price
        product.description = description || product.description
        product.image = image || product.image
        product.brand = brand || product.brand
        product.category = category || product.category
        product.countInStock =
            countInStock !== undefined ? countInStock : product.countInStock

        const updatedProduct = await product.save()
        res.status(200).json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc            Delete A Product
//  route             DELETE /api/products/:id
//  @access         Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await productModel.findById(req.params.id)

    if (product) {
        await productModel.deleteOne({ _id: product._id })
        res.status(200).json({ message: 'Product deleted successfully' })
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc            Create A New Review
//  route             POST /api/products/:id/reviews
//  @access         Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body
    const product = await productModel.findById(req.params.id)
    if (product) {
        // Check if the Product is already reviewed by the user
        const alreadyReviewed = await product.reviews.find(
            (review) => review.user.toString() === req.user._id.toString(),
        )
        if (alreadyReviewed) {
            res.status(400)
            throw new Error('Product Already Reviewed By You')
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        }

        product.reviews.push(review)

        product.numReviews = product.reviews.length

        product.rating =
            product.reviews.reduce((acc, review) => acc + review.rating, 0) /
            product.reviews.length

        await product.save()

        res.status(201).json({ message: 'Review Added Successfully' })
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})
// @desc            Get Top Rated Products
//  route             GET /api/products/top
//  @access         Public
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await productModel.find({}).sort({ rating: -1 }).limit(3)

    if (!products) {
        res.status(404)
        throw new Error('Resource not found')
    } else {
        return res.status(200).json(products)
    }
})
export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts,
}
