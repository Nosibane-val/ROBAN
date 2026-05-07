const jwt = require('jsonwebtoken')
const User = require('../Models/user')

const protect = async (req, res, next) => {
   
   try {
    const authHeader = req.headers['authorization']

    if(!authHeader) {
        return res.status(401).json({message: 'Not authorized, no token!'})
    }

    if(!authHeader.startsWith('Bearer')) {
        return res.status(401).json({message: 'Not authorized, no token!'})
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id).select('-password')
    next()
    
   } catch (error) {
    console.log('JWT error:', error.message)
    res.status(401).json({message: 'Not authorized, Invalid token'})
   }
}



const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        res.status(403).json({message: 'Not authorized, admin only'})
    }
}

module.exports = { protect, adminOnly }