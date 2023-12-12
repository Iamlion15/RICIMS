const userModel = require("../model/userModel")
const commentModel = require("../model/comment")
const interactionModel = require("../model/interactiveComment")


exports.sendComment = async (req, res) => {
    try {
        const senderId = req.user.id;
        const recipientId = req.body.receiver;
        const existingInteraction = await interactionModel.findOne({
            participants: { $all: [senderId, recipientId] },
        });

        if (existingInteraction) {
            // Chat exists, append comment
            const newComment = new commentModel({
                content: req.body.content,
                sender: senderId
            });
            // Save the new comment first
            await newComment.save();
            // Add the saved comment to the existing chat
            existingInteraction.comment.push(newComment);
            // Save the existing comment to update it in the database
            await existingInteraction.save();
        } else {
            // comment doesn't exist, create a new one
            const newComment = new commentModel({
                content: req.body.content,
                sender: senderId
            });
            // Save the new comment first
            await newComment.save();
            const newInteractionComment = new interactionModel({
                participants: [senderId, recipientId],
                documentApproval: req.body.document,
                comment: [newComment],
            });
            // Save the new comment to persist it in the database
            await newInteractionComment.save();
        }
        res.status(200).json({ message: "Successfully sent message" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ err });
    }
}

exports.getCommentsBetweenUsers = async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.body.receiverId;

        // Find the chat between the sender and the receiver
        const comment = await newInteractionComment.findOne({
            participants: { $all: [senderId, receiverId] },
        })
            .populate({
                path: 'participants',
                model: 'user',
            })
            .populate({
                path: 'comment',
                model: 'comment',
                populate: {
                    path: 'sender',
                    model: 'user',
                },
            })
            .exec();

        if (!comment) {
            return res.status(404).json({ error: "Chat not found" });
        }
        // Extract relevant information for the response
        const formattedComment = {
            interactionId: comment._id,
            participants: comment.participants,
            messages: comment.comment.map(conversation => ({
                commentId: conversation._id,
                content: conversation.content,
                sender: {
                    userId: conversation.sender._id,
                    firstname: conversation.sender.firstname,
                    lastname: conversation.sender.lastname,
                },
                read: conversation.Read,
                timestamp: comment.timestamp,
            })),
            item: comment.item,
        };

        res.status(200).json({ comment: formattedComment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.getComment = async (req, res) => {
    try {
        const senderId = req.user.id;

        const comment = await interactionModel.find({
            participants: senderId,
        })
            .populate({
                path: 'participants',
                model: 'user',
            })
            .populate({
                path: 'documentApproval',
                model: 'documentApproval',
                populate: [
                    {
                        path: 'owner',
                        model: 'user',
                    },
                    {
                        path: 'document',
                        model: 'document',
                    },
                ],
            })
            .populate({
                path: 'comment',
                model: 'comment',
                populate: {
                    path: 'sender',
                    model: 'user',
                },
            })
            .exec();

        if (!comment) {
            return res.status(404).json({ error: 'No message found' });
        }
        comment.sort((a, b) => {
            // Get the createdAt time of the latest message for each item
            const createdAtA = a.comment.length > 0 ? new Date(a.comment[a.comment.length-1].createdAt) : new Date(a.createdAt);
            const createdAtB = b.comment.length > 0 ? new Date(b.comment[b.comment.length-1].createdAt) : new Date(b.createdAt);      
            // Compare the createdAt times and sort in descending order
            return createdAtB - createdAtA;
        });

        res.status(200).json(comment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.markAsRead = async (req, res) => {
    const interactionid = req.params.interactionid;

    try {
        const interaction = await interactionModel.findOne({ _id: interactionid }).populate("comment");
        for (const comment of interaction.comment) {
            if (!comment.Read.isRead) {
                await commentModel.findByIdAndUpdate(
                    comment._id,
                    {
                        'Read.isRead': true,
                        'Read.timeOfRead': new Date(),
                    },
                );
            }
        }
        return res.status(200).json({ message: 'Comments marked as read successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};
