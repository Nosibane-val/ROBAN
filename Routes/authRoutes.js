const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../Models/user')

router.post('/signup', async (req, res) => {
    try {
        const {name, email, password} = req.body
        const userExists = await User.findOne({email})
        if(userExists) {
            return res.status(400).json({message: 'Email already registered'})
        }

        const user = await User.create({name, email, password})

        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        )

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})
        if(!user) {
            return res.status(401).json({message: 'Invalid email or Password!'})
        }

        const isMatch = await user.matchPassword(password)
        if(!isMatch) {
            return res.status(401).json({message: 'Invalid email or Password!'})
        }

        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        )

        console.log('Generated token:', token)
        console.log('Secret used:', process.env.JWT_SECRET)

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

module.exports = router