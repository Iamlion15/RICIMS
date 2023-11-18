const DocumentModel = require("../model/documentModel")
const DocumentApproval = require("../model/documentApproval")
const path = require("path")



exports.addDocument = async (req, res) => {
    let fileLocation;
    if (req.file) {
        fileLocation = path.resolve(req.file.path)
    } else {
        return res.status(400).json({ error: 'No file was uploaded' });
    }
    const newDocument = new DocumentModel({
        companyName: req.body.companyName,
        email: req.body.email,
        phone: req.body.phone,
        tsamples: req.body.tsamples,
        psamples: req.body.psamples,
        fileLocation: fileLocation
    });
    try {
        const documentData = await newDocument.save();
        const documentApproval = new DocumentApproval({
            owner: req.user._id,
            document: documentData._id,
            RICA_Approval: {
                approved: false
            },
            RAB_Approval: {
                approved: false
            },
            RSB_Approval: {
                approved: false
            }
        })
        await documentApproval.save()
        return res.status(200).json({ message: "successfully saved document" })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ error: err })
    }
}



exports.updateDocument = async (req, res) => {
    try {
        console.log(req.body)
        const documentApproval = await DocumentApproval.findOne({ _id: req.body.id });
        if (!documentApproval) {
            return res.status(404).json({ message: 'document not found' });
        }
        const document = await DocumentModel.findOne({ _id: documentApproval.document })
        // Update the document with the new data
        document.companyName = req.body.companyName;
        document.email = req.body.email;
        document.phone = req.body.phone;
        document.tsamples = req.body.tsamples
        document.psamples = req.body.psamples;
        const updateDocument = await document.save();
        console.log("updated successfully");
        res.status(200).json({ message: "Successfully updated user" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getDocuments = async (req, res) => {
    try {
        const users = await DocumentApproval.find().populate("document").populate("owner");
        res.status(200).json(users)
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

exports.getOneDocument = async (req, res) => {
    const id = req.params.id
    try {
        const document = await DocumentApproval.findOne({ _id: id }).populate("document");
        const documentUrl = document.document.fileLocation;
        res.status(200).sendFile(documentUrl)
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err })
    }
}

exports.deleteDocument = async (req, res) => {
    const id = req.params.id
    try {
        const documentApproval = DocumentApproval.findOne({ _id: id })
        const document = DocumentModel.findOne({ _id: documentApproval.document })
        await DocumentApproval.findOneAndDelete({ _id: id })
        await DocumentModel.findOneAndDelete({ _id: document._id });
        res.status(200).json({ "message": "succesfully deleted" })
    } catch (err) {
        res.status(400).json({ error: err })
    }
}


exports.ReviewApplication = async (req, res) => {
    try {
        const reviewer = req.body.reviewer;
        const document = await DocumentApproval.findOne({ _id: req.body.id });
        if (!document) {
            return res.status(404).json({ message: 'document not found' });
        }
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        if (reviewer === "RAB") {
            document.RAB_Approval.approved = true
            document.RAB_Approval.timeOfApproval = formattedDate
        }
        else if (reviewer === "RSB") {
            document.RSB_Approval.approved = true
            document.RAB_Approval.timeOfApproval = formattedDate
        }
        else {
            if (reviewer === "RICA") {
                document.RICA_Approval.approved = true
                document.RAB_Approval.timeOfApproval = formattedDate
            }
        }
        await document.save();
        res.status(200).json({ message: "Successfully updated user" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
}


