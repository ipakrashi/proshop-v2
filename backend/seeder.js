import dns from 'dns'
dns.setServers(['8.8.8.8', '8.8.4.4'])
import mongoose from 'mongoose'
import 'dotenv/config'
import colors from 'colors'
import users from './data/users.js'
import products from './data/products.js'

import userModel from './models/userModel.js'
import productModel from './models/productModel.js'
import orderModel from './models/orderModel.js'
import connectDB from './config/db.js'

connectDB()

const importData = async () => {
    try {
        await orderModel.deleteMany()
        await userModel.deleteMany()
        await productModel.deleteMany()

        const createdUsers = await userModel.insertMany(users)
        const adminUser = createdUsers[0]._id
        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser }
        })

        await productModel.insertMany(sampleProducts)
        console.log('Data Imported Sucessfully'.green.inverse)
    } catch (error) {
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

const destrioyData = async () => {
    try {
        await orderModel.deleteMany()
        await productModel.deleteMany()
        await userModel.deleteMany()
    } catch (error) {
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

if (process.argv[2] === '-d') {
    destroyData()
} else {
    importData()
}
