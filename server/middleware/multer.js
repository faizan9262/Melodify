import multer from 'multer'
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import connectCloudinary from '../config/cloudinary.js';

connectCloudinary();

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'Melodify/',
        allowed_formates: ['jpg','png','jpeg']
    }
})
const upload = multer({storage})

export default upload;