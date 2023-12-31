const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    nID:{
        type:String,
        required:true 
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    role:{
        type:String,
        default:"PRODUCER",
        enum:["PRODUCER","RAB","RICA","ADMIN","RSB"]
    },
    password:{
        type:String,
        required:true
    }
    
})



const userModel=mongoose.model("user",userSchema);

module.exports=userModel;