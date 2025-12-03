const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//register controller
const registerUser = async(req,res) =>{
    try{
        const {username,email,password,role} = req.body
        
        //check if the user already exist in the database
        const userExists = await User.findOne({$or:[{username},{email}]})

        if(userExists){
            return res.status(400).json({message:"user already exists"})
        }
        else{
            //hash the password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password,salt)

            //create a new user and save in database
            const newUser = await User.create({
                username,
                email,
                password:hashedPassword,
                role:role || 'user'
            }) 

            if(newUser){
                res.status(200).json({success:true,message:"new user created",data:newUser})
            }
            else{
                res.status(400).json({success:false,message:"failed to create new user"})
            }
        }
        
    }catch(err){
        console.log(err)
        res.status(500).json({success:false,message:"something went wrong when user register"})
    }
}


//login controller
const loginUser = async(req,res) =>{
    try{
        const {username,password} = req.body;

        //check if the user exists in the database
        const user = await User.findOne({username})

        if(!user){
            return res.status(400).json({success:false,message:"invalid username"})
        }
        //check the password is correct
        const isPasswordExist = await bcrypt.compare(password,user.password)
        if(!isPasswordExist){
            return res.status(404).json({success:false,message:"password is invalid"})
        }

        //create user token
        const accessToken = jwt.sign({
            userId : user._id,
            username : user.username,
            role : user.role
        },process.env.JWT_SECRET_KEY,{
            expiresIn : '45m'
        })
    
        res.status(200).json({message:"login successfull",data:accessToken})
    
    }catch(err){
         console.log(err)
         res.status(500).json({success:false,message:"something went wrong when user register"})
    }
}

const changePassword = async(req,res) => {
    try{
        const userId = req.userInfo.userId

        //extract old and new password
        const {oldPassword,newPassword} = req.body

        //find the current logged in user
        const user = await User.findById(userId)

        if(!user)
            return res.status(400).json({success:false,message:"user is not found"})

        //check if the old password is correct
        const isPasswordMatch = await bcrypt.compare(oldPassword,user.password)

        if(!isPasswordMatch)
            return res.status(400).json({success:false,message:"old password is incorrect"})

        //hash the new password
        const salt = await bcrypt.genSalt(10)
        const newHashedPassword = await bcrypt.hash(newPassword,salt)

        //update user password
        user.password = newHashedPassword
        await user.save()

        res.status(200).json({success:true,message:"password changed successfully"})

    }catch(err){
        res.status(404).json({success:false,message:"change password failed"})
        console.log("change password failed",err)
    }
}

module.exports = {
    registerUser,
    loginUser,
    changePassword
}