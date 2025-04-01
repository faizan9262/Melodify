import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    artist:{
        type:String,
        required: true,
    },
    moood:{
        type:[String],
        default:[],
    },
    url:{
        type:String,
        required:true,
    },
    duration:{
        type:Number,
    }
},{timestamps:true})

export const Songmodel = mongoose.model("Songmodel",songSchema);