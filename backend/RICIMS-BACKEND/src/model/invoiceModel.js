const mongoose=require("mongoose")

const invoiceSchema = new mongoose.Schema({
    document:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "documentApproval",
        required: true,
    },
    amount:{
        type:String,
    },
},{timestamps:true});

const invoiceModel = mongoose.model('invoice', invoiceSchema);
module.exports=invoiceModel;
