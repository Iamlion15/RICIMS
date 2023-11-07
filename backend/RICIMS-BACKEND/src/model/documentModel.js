const mongoose =require("mongoose")

const documentSchema=new mongoose.Schema({
    companyName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    psamples:{
        type:String,
        required:true
    },
    tsamples:{
        type:String,
        required:true
    },
    fileLocation:{
        type:String,
        required:true
    }
},{timestamps:true})


const DocumentModel=mongoose.model("document",documentSchema)

module.exports=DocumentModel;