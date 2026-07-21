import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import userModel from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
    let token

    // READ THE JWT FROM COOKIE
    token = req.cookies.jwt
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await userModel
                .findById(decoded.userId)
                .select('-password')
            next()
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized, Invalid Token')
        }
    } else {
        res.status(401)
        throw new Error('Not Authorized, No Token')
    }
})

// ADMIN MIDDLEWARE
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401)
        throw new Error('Not Authorized as Admin')
    }
}
export { protect, admin }
