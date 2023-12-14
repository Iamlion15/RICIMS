const mongoose=require("mongoose")


const documentApprovalSchema=new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    RAB_Approval:{
        approved:Boolean,
        timeOfApproval:Date,
        reviewer:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
    },
    RICA_Approval:{
        approved:Boolean,
        timeOfApproval:Date,
        reviewer:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
    },
    RSB_Approval:{
        approved:Boolean,
        timeOfApproval:Date,
        reviewer:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
    },
    document:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"document"
    },
    status:{
        type:String,
        default:"pending",
        enum:["pending","approved"]
    },
    payed:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const documentApprovalModel=mongoose.model("documentApproval",documentApprovalSchema)

module.exports=documentApprovalModel;