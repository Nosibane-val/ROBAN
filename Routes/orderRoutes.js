const  express = require('express')
const router = express.Router()
const Order = require('../Models/Order')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, async (req, res) => {
    try {
        const { items, totalPrice } = req.body    

        if(!items || items.length === 0) {
            return res.status(400).json({message: 'No item in order!'})
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            totalPrice
        })

        res.status(201).json(order)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
})

router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({user: req.user._id})
        .populate('items.product', 'name price image')

        res.json(orders)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('items.product', 'name price image')

        if(!order) {
            return res.status(404).json({message: 'Order not found!'})
        }

        res.json(order)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

module.exports = router