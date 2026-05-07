const express = require('express')
const router = express.Router()
const Product = require('../Models/Product')
const { protect } = require('../middleware/authMiddleware')
const { upload } = require('../config/cloudinary')


router.get('/', async (req, res) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product){
            return res.status(404).json({message: 'Product not found'})
        }
        res.json(product)
    } catch (error){
        res.status(500).json({message: error.message})
    }
})

router.post('/', protect, upload.single('image'), async (req, res) => {
    try {
      console.log('Body:', req.body)
      console.log('File:', req.file)

      const { name, price, description, category, stock } = req.body
      const product = new Product({
        name,
        price: Number(price),
        description,
        category,
        stock: Number(stock),
        image: req.file ? req.file.path : ''
      })
      const savedProduct = await product.save()
        res.status(201).json(savedProduct)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product){
            return res.status(404).json({message: 'Product not found'})
        }
        res.json({message: 'Product deleted successfully!'})
    } catch (error){
        res.status(500).json({message: error.message})
    }
})

module.exports = router