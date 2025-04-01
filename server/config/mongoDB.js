    import mongoose from "mongoose";
    import dotenv from "dotenv"

    dotenv.config()

    const connectDB = async() =>{
        try {
            await mongoose.connect(process.env.DB_URI)
            console.log("Database Connected!");
        } catch (error) {
            console.log(error.message);
        }
    }

    export default connectDB;