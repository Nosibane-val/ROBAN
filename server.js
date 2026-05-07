require('dotenv').config()
require('./Models/user')
require('./Models/Product')
require('./Models/Order')

// Loads my .env file
const express = require('express')
const connectDB = require('./config/db')
const productRoutes = require('./Routes/productRoutes')
const authRoutes = require('./Routes/authRoutes')
const orderRoutes = require('./Routes/orderRoutes')
const adminRoutes = require('./Routes/adminRoutes')

const app = express()

connectDB()

app.use(express.json())
// Tells the server to understand json data

app.use('/api/auth', authRoutes)
// Tells the server to serve and connect any request coming from /api/authRoutes with authRoutes endpoint

app.use('/api/orders', orderRoutes)
// Tells the server to serve and connect any request coming from /api/orderRoutes with orderRoutes endpoint

app.use('/api/admin', adminRoutes)
// Tells the server to serve and connect any request coming from/api/adminRoutes with adminRoutes endpoint

app.use(express.static('public'))
// Tells express to serve all the files inside the public folder directly to the browser.

app.use('/api/products', productRoutes)
// This connects my product routes to the server. Hence, any request coming with /api is being handled by the productRoutes file.

app.get('/', (req, res) => {
    res.send('Shoplite server is running!')
})

app.listen(process.env.PORT || 5001, () => {
    console.log(`Server is running on Port: ${process.env.PORT || 5001}`)
})