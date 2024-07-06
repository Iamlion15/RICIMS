const DocumentApproval = require("../model/documentApproval")
const DocumentModel = require("../model/documentModel")

exports.documentStatistics = async (req, res) => {
    try {
        const approvals = await DocumentApproval.find({ owner: req.user._id });

        let ricaApproved = 0;
        let rabApproved = 0;
        let rsbApproved = 0;
        let totalNumberSent = approvals.length;

        for (const approval of approvals) {
            const hasRABApproved = approval.RAB_Approval.approved;
            const hasRICAApproved = approval.RICA_Approval.approved;
            const hasRSBApproved = approval.RSB_Approval.approved;
            if (hasRABApproved) {
                rabApproved++;
            }
            if (hasRSBApproved) {
                rsbApproved++;
            }
            if (hasRICAApproved) {
                ricaApproved++;
            }
        }
        res.status(200).json({
            "rica": ricaApproved,
            "rsb": rsbApproved,
            "rab": rabApproved,
            "total": totalNumberSent
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({ "error": err });
    }
}


exports.CountDocumentsByRABApproval = async (req, res) => {
    try {
        const countApproved = await DocumentApproval.countDocuments({ 'RAB_Approval.approved': true });
        const countNotApproved = await DocumentApproval.countDocuments({ 'RAB_Approval.approved': false });

        res.status(200).json({
            approved: countApproved || 0,
            pending: countNotApproved || 0,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.CountDocumentsByRSBApproval = async (req, res) => {
    try {
        const countApproved = await DocumentApproval.countDocuments({ 'RSB_Approval.approved': true });
        const countNotApproved = await DocumentApproval.countDocuments({ 'RAB_Approval.approved': true, 'RSB_Approval.approved': false });

        res.status(200).json({
            approved: countApproved || 0,
            pending: countNotApproved || 0,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.CountDocumentsByRICAApproval = async (req, res) => {
    try {
        const countApproved = await DocumentApproval.countDocuments({ 'RICA_Approval.approved': true });
        const countNotApproved = await DocumentApproval.countDocuments({
            'RAB_Approval.approved': true,
            'RSB_Approval.approved': true,
            'RICA_Approval.approved': false
        });

        res.status(200).json({
            approved: countApproved || 0,
            pending: countNotApproved || 0,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};


exports.getDocumentInRange = async (req, res) => {
    const { startDate, endDate, organisation } = req.body;
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (organisation === "RAB") {
            const count = await DocumentApproval.countDocuments({
                'RAB_Approval.timeOfApproval': { $gte: start, $lte: end }
            });
            const documents = await DocumentApproval.find({
                'RAB_Approval.timeOfApproval': { $gte: start, $lte: end }
            }).populate("owner").populate("document");

            res.status(200).json({ count, documents });
        }
        else if (organisation === "RSB") {
            const count = await DocumentApproval.countDocuments({
                'RSB_Approval.timeOfApproval': { $gte: start, $lte: end }
            });
            const documents = await DocumentApproval.find({
                'RSB_Approval.timeOfApproval': { $gte: start, $lte: end }
            }).populate("owner").populate("document");

            res.status(200).json({ count, documents });
        }
        else {
            if (organisation === "RICA") {
                const count = await DocumentApproval.countDocuments({
                    'RICA_Approval.timeOfApproval': { $gte: start, $lte: end }
                });
                const documents = await DocumentApproval.find({
                    'RICA_Approval.timeOfApproval': { $gte: start, $lte: end }
                }).populate("owner").populate("document");
                res.status(200).json({ count, documents });
            }
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getPendingDocumentInRange = async (req, res) => {
    const { startDate, endDate, organisation } = req.body;
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        let count, documents;

        if (organisation === "RAB") {
            count = await DocumentApproval.countDocuments({
                'RAB_Approval.approved': false,
                createdAt: { $gte: start, $lte: end }
            });
            documents = await DocumentApproval.find({
                'RAB_Approval.approved': false,
                createdAt: { $gte: start, $lte: end }
            }).populate("owner").populate("document");
        } else if (organisation === "RSB") {
            count = await DocumentApproval.countDocuments({
                'RAB_Approval.approved': true,
                'RSB_Approval.approved': false,
                createdAt: { $gte: start, $lte: end }
            });
            documents = await DocumentApproval.find({
                'RAB_Approval.approved': true,
                'RSB_Approval.approved': false,
                createdAt: { $gte: start, $lte: end }
            }).populate("owner").populate("document");
        } else if (organisation === "RICA") {
            count = await DocumentApproval.countDocuments({
                'RAB_Approval.approved': true,
                'RSB_Approval.approved': true,
                'RICA_Approval.approved': false,
                createdAt: { $gte: start, $lte: end }
            });
            documents = await DocumentApproval.find({
                'RAB_Approval.approved': true,
                'RSB_Approval.approved': true,
                'RICA_Approval.approved': false,
                createdAt: { $gte: start, $lte: end }
            }).populate("owner").populate("document");
        }

        res.status(200).json({ count, documents });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};



exports.getItemTypes = async (req, res) => {
    try {
        const uniquePsamples = await DocumentModel.distinct('psamples');
        res.json(uniquePsamples);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.generateApprovedReport = async (req, res) => {
    const { startDate, endDate, itemChose, organization, category } = req.body;
    console.log(startDate);
    console.log(endDate);
    console.log(itemChose);
    console.log(organization);
    console.log(category);
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        let query = {}
        if (category === "Reviewed") {
            if (organization === "RAB") {
                query = {
                    'RAB_Approval.approved': true,
                    createdAt: { $gte: start, $lte: end }
                };
            } else if (organization === "RSB") {
                query = {
                    'RAB_Approval.approved': true,
                    'RSB_Approval.approved': true,
                    createdAt: { $gte: start, $lte: end }
                };
            } else if (organization === "RICA") {
                query = {
                    'RAB_Approval.approved': true,
                    'RSB_Approval.approved': true,
                    'RICA_Approval.approved': true,
                    createdAt: { $gte: start, $lte: end }
                };
            }
            const documents = await DocumentApproval.find(query)
                .populate("owner")
                .populate("document");
            const filteredDocuments = documents.filter(doc => doc.document.psamples === itemChose);
            res.status(200).json(filteredDocuments);
        }
        else {
            if (category === "Pending") {
                if (organization === "RAB") {
                    query = {
                        'RAB_Approval.approved': false,
                        createdAt: { $gte: start, $lte: end }
                    };
                } else if (organization === "RSB") {
                    query = {
                        'RAB_Approval.approved': true,
                        'RSB_Approval.approved': false,
                        createdAt: { $gte: start, $lte: end }
                    };
                } else if (organization === "RICA") {
                    query = {
                        'RAB_Approval.approved': true,
                        'RSB_Approval.approved': true,
                        'RICA_Approval.approved': false,
                        createdAt: { $gte: start, $lte: end }
                    };
                }
                query = {
                    ...query,
                    'document.psamples': itemChose
                };

                const count = await DocumentApproval.countDocuments(query);
                const documents = await DocumentApproval.find(query)
                    .populate("owner")
                    .populate("document");

                res.status(200).json({ count, documents });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};


exports.CountDocumentsSentAndApprovedByMonth = async (req, res) => {
    try {
        const allDocumentApprovals = await DocumentApproval.find({
            "createdAt": { $exists: true, $ne: null },
            "RAB_Approval.timeOfApproval": { $exists: true, $ne: null }
        });

        const countsPerMonth = Array.from({ length: 12 }, () => ({ documentsSent: 0, documentsApproved: 0 }));

        allDocumentApprovals.forEach(approval => {
            const monthIndex = approval.createdAt.getMonth();

            countsPerMonth[monthIndex].documentsSent++;

            if (approval.RAB_Approval.approved) {
                countsPerMonth[monthIndex].documentsApproved++;
            }
        });

        res.status(200).json(countsPerMonth);
    } catch (error) {
        console.error('Error counting documents sent and approved by month:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.CountRSBDocumentsSentAndApprovedByMonth = async (req, res) => {
    try {
        const allDocumentApprovals = await DocumentApproval.find({
            "createdAt": { $exists: true, $ne: null },
            "RSB_Approval.timeOfApproval": { $exists: true, $ne: null }
        });

        const countsPerMonth = Array.from({ length: 12 }, () => ({ documentsSent: 0, documentsApproved: 0 }));

        allDocumentApprovals.forEach(approval => {
            const monthIndex = approval.createdAt.getMonth();

            countsPerMonth[monthIndex].documentsSent++;

            if (approval.RAB_Approval.approved) {
                countsPerMonth[monthIndex].documentsApproved++;
            }
        });

        res.status(200).json(countsPerMonth);
    } catch (error) {
        console.error('Error counting documents sent and approved by month:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.CountRICADocumentsSentAndApprovedByMonth = async (req, res) => {
    try {
        const allDocumentApprovals = await DocumentApproval.find({
            "createdAt": { $exists: true, $ne: null },
            "RICA_Approval.timeOfApproval": { $exists: true, $ne: null }
        });

        const countsPerMonth = Array.from({ length: 12 }, () => ({ documentsSent: 0, documentsApproved: 0 }));

        allDocumentApprovals.forEach(approval => {
            const monthIndex = approval.createdAt.getMonth();

            countsPerMonth[monthIndex].documentsSent++;

            if (approval.RAB_Approval.approved) {
                countsPerMonth[monthIndex].documentsApproved++;
            }
        });

        res.status(200).json(countsPerMonth);
    } catch (error) {
        console.error('Error counting documents sent and approved by month:', error);
        res.status(500).json({ error: 'Server error' });
    }
};




exports.documentApprovedStatistics = async (req, res) => {
    try {
        const approvals = await DocumentApproval.find({ owner: req.user._id });

        let approved = 0;
        let pending = 0;


        for (const approval of approvals) {
            const approvedstatus = approval.status;
            if (approvedstatus === "approved") {
                approved++
            }
            else {
                pending++
            }
        }
        res.status(200).json({
            "approved": approved,
            "pending": pending,

        });
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({ "error": err });
    }
}











