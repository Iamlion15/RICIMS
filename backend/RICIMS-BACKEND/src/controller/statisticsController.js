const DocumentApproval = require("../model/documentApproval")
const DocumentModel = require("../model/documentModel")

exports.documentStatistics = async (req, res) => {
    try {
        const approvals = await DocumentApproval.find();

        let approvedCount = 0;
        let pendingCount = 0;
        let canceledCount = 0;
        let underReviewCount = 0;

        for (const approval of approvals) {
            const hasRABApproved = approval.RAB_Approval.approved;
            const hasRICAApproved = approval.RICA_Approval.approved;
            const hasRSBApproved = approval.RSB_Approval.approved;
            const hasAnyApprovalTime = approval.RAB_Approval.timeOfApproval || approval.RICA_Approval.timeOfApproval || approval.RSB_Approval.timeOfApproval;

            if (hasRABApproved && hasRICAApproved && hasRSBApproved) {
                approvedCount++;
            } else if (hasRABApproved && hasRSBApproved && !hasRICAApproved) {
                underReviewCount++;
            } else if (!hasRABApproved && !hasRICAApproved && !hasRSBApproved) {
                if (hasAnyApprovalTime) {
                    canceledCount++;
                } else {
                    pendingCount++;
                }
            } else {
                pendingCount++;
            }
        }

        res.status(200).json({
            "approved": approvedCount,
            "underReview": underReviewCount,
            "pending": pendingCount,
            "canceled": canceledCount
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




exports.CountPercentageByRABApproval = async (req, res) => {
    try {
        const countApproved = await DocumentApproval.countDocuments({ 'RAB_Approval.approved': true });
        const countNotApproved = await DocumentApproval.countDocuments({ 'RAB_Approval.approved': false });
        const totalDocuments = countApproved + countNotApproved;

        const approvedPercentage = totalDocuments > 0 ? (countApproved / totalDocuments) * 100 : 0;
        const notApprovedPercentage = totalDocuments > 0 ? (countNotApproved / totalDocuments) * 100 : 0;

        res.status(200).json({
            approved: countApproved || 0,
            pending: countNotApproved || 0,
            approvedPercentage: approvedPercentage.toFixed(2), // Formatting to 2 decimal places
            notApprovedPercentage: notApprovedPercentage.toFixed(2) // Formatting to 2 decimal places
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};










