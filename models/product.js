import mongoose from "mongoose";
const productSchema=new mongoose.Schema({
    userId:{type:String,required:true,ref:"user"},
    name:{type:String,required:true},
})