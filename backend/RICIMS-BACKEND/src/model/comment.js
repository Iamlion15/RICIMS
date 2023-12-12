const mongoose=require("mongoose")

const commentSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    content:{
        type: String,
        default: false, 
    },
    action:{
        type:String,
        enum:["REJECTED","APPROVED"]
    },
    Read: {
        isRead:{
        type: Boolean,
        default: false,
        },
        timeOfRead:Date

    },
},{timestamps:true});

const commentModel = mongoose.model('comment', commentSchema);
module.exports=commentModel;
