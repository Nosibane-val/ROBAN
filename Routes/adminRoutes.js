const express = require('express')
const router = express.Router()
const Product = require('../Models/Product')
const Order = require('../Models/Order')
const User = require('../Models/user')
const { protect, adminOnly } = require('../middleware/authMiddleware')


router.get('/users', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find().select('-password')
        res.json(users)
    } catch (error) {
        res.status(500).json({message: error.mesage})
    }
})

router.get('/orders', protect, adminOnly, async (req, res) => {
    try {
        const orders = await Order.find()
        .populate('user', 'name email')
        .populate('items.product', 'name price')
        res.json(orders)
    } catch (error) {
        console.log('Admin orders error:', error)
        res.status(500).json({message: error.mesage})
    }
})

router.put('/orders/:id', protect, adminOnly, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)

        if (!order) {
            return res.status(404).json({message: 'Order not found'})
        }
        order.status = req.body.status
        const updateOrder = await order.save()
        res.json(updateOrder)
    } catch (error) {
        res.status(500).json({message: error.mesage})
    }
})

router.delete('/users/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user) {
            res.status(500).json({message: 'User not found'})
        }
        res.json({message: 'User deleted'})
    } catch (error) {
        res.status(500).json({message: error.mesage})
    }
})

module.exports = router