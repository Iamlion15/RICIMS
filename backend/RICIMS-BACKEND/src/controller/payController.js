const DocumentModel = require("../model/documentModel")
const DocumentApproval = require("../model/documentApproval")
const invoiceModel = require("../model/invoiceModel")
const stripe = require('stripe')(process.env.STRIPE_KEY)
exports.acceptPayment = async (req, res) => {
    try {
        const document = await DocumentApproval.findOne({ _id: req.body.id });
        if (!document) {
            return res.status(404).json({ message: 'document not found' });
        }
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'rwf',
                        product_data: {
                            name: req.body.documentName,
                        },
                        unit_amount: req.body.amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            payment_method_types: ['card'],
            success_url: `http://localhost:5000/api/document/processsuccess/${req.body.id}/${req.body.amount}`,
            cancel_url: `http://localhost:5000/api/document/processfailure`,
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Error creating payment session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.processFailureInfo = async (req, res) => {
    try {
        res.redirect('http://localhost:3000/Producer?status=failure')
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.processSuccessInfo = async (req, res) => {
    try {
        const documentProcessing = await DocumentApproval.findOne({ _id: req.params.id });
        documentProcessing.payed = true;
        await DocumentApproval.findOneAndUpdate(
            { _id: documentProcessing._id },
            documentProcessing
        );
        const invoice = new invoiceModel({
            document: req.params.id,
            amount: req.params.amount
        })
        await invoice.save()
        res.redirect('http://localhost:3000/Producer?status=success')
    } catch (error) {
        console.log(error);
    }
}

exports.getInvoices = async (req, res) => {
    try {
        const invoices = await invoiceModel
            .find()
            .populate({
                path: 'document',
                populate: {
                    path: 'document'
                }
            })
        res.status(200).json(invoices);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
};

