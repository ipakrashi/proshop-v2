import path from 'path'
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
import uploadRoutes from './routes/uploadRoutes.js'
import { errorHandler, notFound } from './middlewares/errorMiddleware.js'
import { populate } from 'dotenv'
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
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) =>
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID }),
)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
    // set Static folder
    app.use(express.static(path.join(__dirname, 'frontend/build')))

    // any route that is not api will be redirected to index.html
    app.get('{*path}', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    })
} else {
    app.get('/', (req, res) => {
        res.send('API Is Running....')
    })
}
app.use(notFound)
app.use(errorHandler)

// Server Start (Always keep this at the absolute bottom)
app.listen(PORT, () => {
    console.log(`Server Started On Port : ${PORT}`.blue.bold)
})
