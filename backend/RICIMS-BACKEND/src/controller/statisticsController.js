const DocumentApproval = require("../model/documentApproval")

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
