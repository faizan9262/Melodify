import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import dotenv from 'dotenv'

dotenv.config()

const connectCloudinary = async() =>{
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET
    })
}

export default connectCloudinary;