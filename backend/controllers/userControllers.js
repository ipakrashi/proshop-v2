import asyncHandler from 'express-async-handler'
import userModel from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// @desc           Auth User & Get Token
//  route             POST  /api/users/auth
//  @access         Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        })

        // SET JWT AS HTTP ONLY COOKIE
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
            message: 'Authorized User',
        })
    } else {
        return res.status(400).json({ message: 'User Not Found' })
    }
})

// @desc           Register User
//  route             POST /api/users/
//  @access         Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, isAdmin } = req.body

    // Check if the user exists
    const userExists = await userModel.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User Already Exists with this email')
    } else {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            isAdmin,
        })

        if (user) {
            // Setting JWT for the user created
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                {
                    expiresIn: '30d',
                },
            )

            // SET JWT AS HTTP ONLY COOKIE
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            })

            return res.status(201).json({
                id: user.id,
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin,
                message: 'User Registered Sucessfully and Token Generated',
            })
        } else {
            res.status(400)
            throw new Error('User Not Created.. Invalid Data')
        }
    }
})

// @desc           Logout User /Clear the cookie
//  route             POST /api/users/logout
//  @access         Public
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    })
    return res.status(200).json({ message: 'Logged Out Successfully' })
})

// @desc           get User Profile
//  route             GET /api/users/profile
//  @access         Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user._id)
    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            message: `User Profile fetched for ${user._id}`,
        })
    } else {
        res.status(404)
        throw new Error('User Not Found')
    }
})

// @desc           update User Profile
//  route             PUT /api/users/profile
//  @access         Private
const updateUserProfile = asyncHandler(async (req, res) => {
    // Get The User Details
    const user = await userModel.findById(req.user._id)
    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        if (req.body.password) {
            user.password = req.body.password
        }
        const updatedUser = await user.save()
        return res.status(200).json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            message: `User Profile Updated for ${updatedUser._id}`,
        })
    } else {
        res.status(404)
        throw new Error('User Not Found')
    }
})

// @desc           Get Users
//  route             POST  /api/users/
//  @access         Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await userModel.find({})
    return res.status(200).json(users)
})

// @desc           Delete Users
//  route             DELETE  /api/users/:id
//  @access         Private/Admin
const deleteUsers = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.params.id).select('-password')
    if (user) {
        // Prevent an admin from deleting their own account
        if (user._id.toString() === req.user._id.toString()) {
            res.status(400)
            throw new Error('You cannot delete your own admin account')
        }
        const deletedUser = await userModel.deleteOne({ _id: user._id })
        res.status(200).json({ message: 'User removed successfully' })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc           Get Users by ID
//  route             GET  /api/users/:id
//  @access         Private/Admin
const getUserByID = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.params.id).select('-password')
    if (user) {
        return res.status(200).json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc           Update Users
//  route             PUT  /api/users/:id
//  @access         Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.params.id)
    if (user) {
        // 1. Update properties if provided in body, otherwise keep existing values
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        // Use boolean check because req.body.isAdmin can be false
        if (req.body.isAdmin !== undefined) {
            user.isAdmin = Boolean(req.body.isAdmin)
        }
        // 2. Save changes to MongoDB
        const updatedUser = await user.save()
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUsers,
    getUserByID,
    updateUser,
}
