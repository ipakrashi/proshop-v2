import express from 'express'
import {
    createProduct,
    updateProduct,
    getProductById,
    getProducts,
    deleteProduct,
    createProductReview,
} from '../controllers/productControllers.js'
import { protect, admin } from '../middlewares/authMiddleware.js'
const router = express.Router()

router.get('/', getProducts)
router.get('/:id', getProductById)
router.put('/:id', protect, admin, updateProduct)
router.delete('/:id', protect, admin, deleteProduct)
router.post('/', protect, admin, createProduct)
router.post('/:id/reviews', protect, createProductReview)

export default router
