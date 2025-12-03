const express = require('express')
const adminMiddleware = require('../middleware/adminMiddleware')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

router.get('/welcome',authMiddleware, adminMiddleware,(req,res)=>{
    res.status(200).json({message:"welcome to admin page"})
})



module.exports = router;