require('dotenv').config()
const mongoose = require('mongoose')

const connectToDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("database connected successfully")
    }catch(err){
        console.log("error in database connection",err)
        process.exit(1)
    }
}

module.exports = connectToDB