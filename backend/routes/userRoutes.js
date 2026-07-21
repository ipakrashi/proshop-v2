import express from 'express'
import {
    authUser,
    deleteUsers,
    getUserByID,
    getUserProfile,
    getUsers,
    logoutUser,
    registerUser,
    updateUser,
    updateUserProfile,
} from '../controllers/userControllers.js'
import { protect, admin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', protect, admin, getUsers)
router.post('/', registerUser)
router.post('/auth', authUser)
router.post('/logout', logoutUser)
router.get('/profile', protect, getUserProfile)
router.put('/profile', protect, updateUserProfile)
router.delete('/:id', protect, admin, deleteUsers)
router.get('/:id', protect, admin, getUserByID)
router.put('/:id', protect, admin, updateUser)

export default router
