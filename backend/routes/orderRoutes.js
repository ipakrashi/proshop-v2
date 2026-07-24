import express from 'express'
const router = express.Router()
import {
    getOrders,
    getMyOrders,
    getOrderById,
    addOrderItems,
    updateOrderToDelivered,
    updateOrderToPaid,
} from '../controllers/orderControllers.js'
import { protect, admin } from '../middlewares/authMiddleware.js'

router.post('/', protect, addOrderItems)
router.get('/', protect, admin, getOrders)
router.get('/myorders', protect, getMyOrders)
router.get('/:id', protect, getOrderById)
router.put('/:id/pay', protect, updateOrderToPaid)
router.put('/:id/deliver', protect, admin, updateOrderToDelivered)

export default router
