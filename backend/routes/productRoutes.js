import express from 'express'
import {
    createProduct,
    updateProduct,
    getProductById,
    getProducts,
} from '../controllers/productControllers.js'
import { protect, admin } from '../middlewares/authMiddleware.js'
const router = express.Router()

router.get('/', getProducts)
router.get('/:id', getProductById)
router.put('/:id', protect, admin, updateProduct)
router.post('/', protect, admin, createProduct)

export default router
