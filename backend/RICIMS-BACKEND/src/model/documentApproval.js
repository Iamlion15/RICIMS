const mongoose=require("mongoose")


const documentApprovalSchema=new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    RAB_Approval:{
        approved:Boolean,
        timeOfApproval:Date
    },
    RICA_Approval:{
        approved:Boolean,
        timeOfApproval:Date
    },
    RSB_Approval:{
        approved:Boolean,
        timeOfApproval:Date
    },
    document:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"document"
    }
},{timestamps:true})

const documentApprovalModel=mongoose.model("documentApproval",documentApprovalSchema)

module.exports=documentApprovalModel;