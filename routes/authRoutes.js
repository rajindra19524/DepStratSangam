const express = require('express')
const app = express()
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')

const {registerUser,loginUser, changePassword} = require('../controllers/authController')

router.post('/login',loginUser)

router.post('/register',registerUser)

router.post('/changePassword',authMiddleware,changePassword)


module.exports = router