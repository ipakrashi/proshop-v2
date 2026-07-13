import 'dotenv/config'
import dns from 'dns'
dns.setServers(['8.8.8.8', '8.8.4.4'])
import express from 'express'
import products from './data/products.js'

const app = express()
const PORT = process.env.PORT || 8000

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Routes
app.get('/', (req, res) => {
    res.send('<h1>HOME PAGE</h1>')
})

app.get('/api/products', (req, res) => {
    res.json(products)
})

app.get('/api/products/:id', (req, res) => {
    const product = products.find((p) => p._id == req.params.id)
    if (!product) {
        return res.status(404).json({ message: 'Product not found' })
    }

    res.json(product)
})

// Server Start (Always keep this at the absolute bottom)
app.listen(PORT, () => {
    console.log(`Server Started On Port : ${PORT}`)
})
