const express = require('express')
const adminMiddleware = require('../middleware/adminMiddleware')
const authMiddleware = require('../middleware/authMiddleware')
 const uploadMiddleware = require('../middleware/uploadMiddleware')
const {uploadImageController, fetchImagesController, deleteImageController} = require('../controllers/imageController')
//const uploadImageController = require('../controllers/imageController')
const router = express.Router()


router.post('/upload',authMiddleware,uploadMiddleware.single('image'),uploadImageController)

router.get('/fetch',authMiddleware,fetchImagesController)

router.delete('/:id',authMiddleware,deleteImageController)


module.exports = router;

