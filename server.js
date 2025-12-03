require('dotenv').config()
const express = require('express')
const connectToDB = require('./database/db')
const authRoutes = require('./routes/authRoutes')
const homeRoutes = require('./routes/homeRoute')
const adminRoutes = require('./routes/adminRoute')
const imageRoutes = require('./routes/imageRoute')

const app = express()
app.use(express.json())

connectToDB()

app.use('/api/auth',authRoutes)
app.use('/api/home',homeRoutes)
app.use('./api/admin',adminRoutes)
app.use('/api/image',imageRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT , ()=>console.log("server run on port 3000"))


