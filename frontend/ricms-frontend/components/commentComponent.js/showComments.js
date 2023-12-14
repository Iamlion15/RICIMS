import axios from "axios";
import { useState, useEffect } from "react";
import formatDateToCustomFormat from "@/helpers/dateFormatter";


const ShowComment = ({ data, goBack, loggedInUserId, commentData, setCommentData,isOpen }) => {
    const handleSendComment = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': JSON.parse(localStorage.getItem("token"))
            }
        }
        try {
            const response = await axios.post("http://localhost:5000/api/comment/send", commentData, config)
            setCommentData({
                ...commentData, content: "",
            })
            goBack();
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(async() => {
        if (data && data.comment && data.comment.length > 0) {
            const userWhoLoggedIn = JSON.parse(localStorage.getItem('loggedInUser'))._id
            const lastComment = data.comment[data.comment.length - 1];
            // Check if the last message is not marked as read
            if (!lastComment.Read.isRead && lastComment.sender.userId !== userWhoLoggedIn) {
                const markReadConfig = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': JSON.parse(localStorage.getItem('token')),
                    },
                };
                try {
                    // Mark the message as read
                   await axios.put(`http://localhost:5000/api/comment/markasread/${data._id}`, {}, markReadConfig);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    },[isOpen])
    return (
        <>
            <table className="table table-borderless">
                <thead>
                    <tr className="table-danger">
                        <td>Description of the document</td>
                    </tr>
                </thead>
                <div className="mx-3">
                    <tbody>
                        <tr>
                            <td>document owner:</td>
                            <td>{data.documentApproval.owner.firstname} {data.documentApproval.owner.lastname}</td>
                        </tr>
                        <tr>
                            <td>Chemical Type:</td>
                            <td>{data.documentApproval.document.psamples}</td>
                        </tr>
                        <tr>
                            <td>Date submitted on:</td>
                            <td>{formatDateToCustomFormat(data.documentApproval.createdAt)}</td>
                        </tr>
                    </tbody>
                </div>
            </table>
            <table className="table table-borderless">
                <thead>
                    <tr className="table-info">
                        <td>Unread comments</td>
                        <td>Comment sent date</td>
                    </tr>
                </thead>
            </table>
            <style>
                {`
                            /* Hide scrollbar for Chrome, Safari, and Edge */
                            ::-webkit-scrollbar {
                                width: 0;
                            }

                            /* Optional: Style scrollbar track if you want to customize its appearance */
                            ::-webkit-scrollbar-track {
                                background: transparent;
                            }
                        `}
            </style>
            <table className="mx-3" style={{ maxHeight: '150px', overflowY: 'scroll', display: 'block' }}>
                <tbody>
                    {data.comment.map((comments) => (
                        loggedInUserId !== comments.sender._id && comments.Read.isRead === false && (
                            <tr key={comments._id}>
                                <td>{comments.content}</td>
                                <td style={{ width: "200px" }}></td>
                                <td className="text-primary text-lead"><small>{formatDateToCustomFormat(comments.createdAt)}</small></td>
                            </tr>
                        )
                    ))}
                </tbody>
            </table>

            <div className="m-3">
                <div className="">
                    <input type="text" className="form-control" onChange={(e) => setCommentData({ ...commentData, content: e.target.value })} />
                </div>
                <div className="row mt-2 mb-3 mx-2">
                    <div className="col">
                        <button className="btn btn-outline-primary" onClick={goBack}>Go back</button>
                    </div>
                    <div className="col">
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-primary" onClick={(e) => handleSendComment(e)}>send comment</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}



export default ShowComment;