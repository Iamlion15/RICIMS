const mongoose=require("mongoose")

const interactiveCommentSchema = new mongoose.Schema({
    participants:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }],
    documentApproval:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "documentApproval",
    },
    comment:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
    }]
},{timestamps:true});

const interactiveCommentModel = mongoose.model('interaction', interactiveCommentSchema);
module.exports=interactiveCommentModel;
