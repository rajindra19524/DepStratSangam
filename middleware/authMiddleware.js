
const jwt = require('jsonwebtoken')

const authMiddleware = async(req,res,next) => {
    const authHeader = req.headers['authorization']
    console.log(authHeader)
    const token = authHeader && authHeader.split(" ")[1]

    if(!token){
        return res.status(404).json({message:"user not authenticated"})
    }

    //decode the token
    try{
        const decodedTokenInfo = jwt.verify(token,process.env.JWT_SECRET_KEY)
        console.log(decodedTokenInfo)

        req.userInfo = decodedTokenInfo
        next()

    }catch(err){
        res.status(404).json({message:"error in decoding the token",data:err})
    }
    
}


module.exports = authMiddleware

