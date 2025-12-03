const Image = require('../models/image')
const uploadToCloudinary = require('../helpers/cloudinaryHelper')
const cloudinary = require('../config/cloudinary')

const uploadImageController = async(req,res) => {
    try{
        //check if file is missing in request object
        if(!req.file)
            return res.status(400).json({success:false,message:"file not in the request"})

        //upload to cloudinary
        const {url,publicId} = await uploadToCloudinary(req.file.path)

        //store the image uri and publicId along with the userId in the mongodb
        const newlyUploadedImage = await Image.create({
            url,
            publicId,
            uploadedBy:req.userInfo.userId
        })

        res.status(200).json({success:true,message:"image uploaded successfully",image:newlyUploadedImage})


    }catch(err){
            res.status(404).json({success:false,message:"something went wrong while uploading image",error:err.message})
    }
}

const fetchImagesController = async(req,res) => {
    try{
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page-1) * limit

        const sortBy = req.query.sortBy || 'createdAt'
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const totalImages = await Image.countDocuments()
        const totalPages = Math.ceil(totalImages/limit)

        sortObj[sortBy] = sortOrder 
        const images = await Image.find().sort(sortObj).skip(skip).limit()

        if(images){
            res.status(200).json({success:true,message:"images successfully fetched",
                currentPage:page,totalPages:totalPages,totalImages:totalImages,
                data:images})
        }
    }catch(err){
        console.log(err)
        res.status(404).json({success:false,message:"error in fetching images"})
    }
}

const deleteImageController = async(req,res) => {
    try{
        const idOfImageToBeDeleted = req.params.id
        const userId = user.userInfo.userId

        const image = await Image.findById(idOfImageToBeDeleted)

        if(!image){
            return res.status(400).json({success:false,message:"image does not exist in the database"})
        }

        //check if the image is uploaded by the user who is trying to delete it
        if(image.uploadedBy.toString() !== userId)
            return res.status(400).json({message:"you are not authorized to delete this image"})

        //delete this image from cloudinary storage
        await cloudinary.uploader.destroy(image.publicId)

        //delete the image from the mongodb database
        await Image.findByIdAndDelete(idOfImageToBeDeleted)

        res.status(200).json({success:true,message:"image deleted successfully"})



    }catch(err){
         console.log(err)
        res.status(404).json({success:false,message:"error in deleting images"})
    }
}

module.exports = {
    uploadImageController,
    fetchImagesController,
    deleteImageController
}