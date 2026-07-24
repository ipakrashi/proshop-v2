import 'dotenv/config'
import dns from 'dns'
dns.setServers(['8.8.8.8', '8.8.4.4'])
import express from 'express'
import products from './data/products.js'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
import colors from 'colors'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import { errorHandler, notFound } from './middlewares/errorMiddleware.js'
const app = express()
const PORT = process.env.PORT || 8000

//Connect To Database
connectDB()

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)

app.use(notFound)
app.use(errorHandler)

// Server Start (Always keep this at the absolute bottom)
app.listen(PORT, () => {
    console.log(`Server Started On Port : ${PORT}`.blue.bold)
})
