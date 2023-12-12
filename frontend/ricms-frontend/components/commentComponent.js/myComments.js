import { useEffect, useState } from "react";
import axios from "axios";
import ShowComment from "./showComments";

const MyComments = () => {
    const [data, setData] = useState([])
    const [loggedInUserId, setLoggedInUserId] = useState('')
    const [info, setInfo] = useState()
    const [showCommentBetweenUsers, setShowCommentBetweenUsers] = useState(false)
    const [commentData, setCommentData] = useState({
        receiver: "",
        content: ""
    })
    const toggleScreens = () => {
        setShowCommentBetweenUsers(!showCommentBetweenUsers)
    }
    const show = (com) => {
        setInfo(com)
        setShowCommentBetweenUsers(true)
        let receiverid;
        for (let i = 0; i < com.participants.length; i++) {
            if (loggedInUserId !== com.participants[i]._id) {
                receiverid = com.participants[i]._id
            }
        }
        setCommentData({ ...commentData, receiver: receiverid })
    }
    useEffect(async () => {
        setLoggedInUserId(JSON.parse(localStorage.getItem('loggedInUser'))._id);
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': JSON.parse(localStorage.getItem("token"))
            }
        }
        try {
            const response = await axios.get("http://localhost:5000/api/comment/getcomments", config)
            console.log(response.data);
            setData(response.data)
        } catch (error) {
            console.log(error)
        }
    }, [showCommentBetweenUsers])
    return (
        <div className="card mt-3 font-monospace">
            <div className="card-header">
                <div className="row">
                    <div className="col m-2">
                        <h4 className="text-primary">Comment fom different users</h4>
                    </div>
                    {showCommentBetweenUsers&&<div className="col">
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-primary btn-sm">
                                <div className="d-flex flex-row">
                                    <span className="mx-2">Comment history</span>
                                    <i class="bi bi-journals"></i>
                                </div>
                                </button>
                        </div>
                    </div>}
                </div>
            </div>
            {!showCommentBetweenUsers && (
                <table className="table table-borderless table-hover">
                    <thead>
                        <tr className="table-primary">
                            <td>No.</td>
                            <td>USER</td>
                            <td>ROLE</td>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((convo, index) => {
                            return (
                                <tr key={convo._id} className={`${!convo.comment[convo.comment.length - 1].Read.isRead &&
                                    convo.comment[convo.comment.length - 1].sender._id !== loggedInUserId
                                    ? 'table-active'
                                    : ''
                                    } ${convo.comment[convo.comment.length - 1].action
                                        ? 'table-danger'
                                        : ''
                                    }`}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => show(convo)}
                                >
                                    <td>{index + 1}</td>
                                    <td>
                                        {convo.participants.map((participant) => (
                                            loggedInUserId !== participant._id && (
                                                <span key={participant._id}>
                                                    {participant.firstname} {participant.lastname}
                                                </span>
                                            )
                                        ))}
                                    </td>
                                    <td>
                                        {convo.participants.map((participant) => (
                                            loggedInUserId !== participant._id && (
                                                <span key={participant._id}>
                                                    {participant.role}
                                                </span>
                                            )
                                        ))}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>)}
            {showCommentBetweenUsers && (
                <ShowComment toggleScreens={toggleScreens}
                    data={info}
                    loggedInUserId={loggedInUserId}
                    goBack={toggleScreens}
                    commentData={commentData}
                    isOpen={showCommentBetweenUsers}
                    setCommentData={setCommentData}
                />
            )}
        </div>)
}


export default MyComments;