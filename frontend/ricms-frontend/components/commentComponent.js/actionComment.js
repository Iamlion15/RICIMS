import axios from "axios";


const TakeAction = ({ data, commentData,setCommentData,goBack,confirmHandler }) => {
    const handleSendComment = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': JSON.parse(localStorage.getItem("token"))
            }
        }
        console.log(commentData)
        try {
            const response = await axios.post("http://localhost:5000/api/comment/send", commentData, config)
            setCommentData({
                ...commentData, content: "",
            })
            confirmHandler()
            goBack();
        } catch (error) {
            console.log(error)
        }
    }
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
                            <td>{data.firstname} {data.lastname}</td>
                        </tr>
                        <tr>
                            <td>Chemical Type:</td>
                            <td>{data.chemicalType}</td>
                        </tr>
                        <tr>
                            <td>Number of samples:</td>
                            <td>{data.tsamples}</td>
                        </tr>
                        <tr>
                            <td>Date submitted on:</td>
                            <td>{data.submittedOn}</td>
                        </tr>
                    </tbody>
                </div>
            </table>
            <div className="m-3">
                <span className="mb-2">Add your comment here</span>
            </div>
            <table className="table table-borderless mt-2">
                <thead>
                    <tr className="table-info">
                        <td>Recipient details</td>
                    </tr>
                </thead>
                <div className="mx-3">
                    <tbody>
                        <tr>
                            <td>recipient names:</td>
                            <td className="text-primary"><strong>{commentData.recipientFirstname} {commentData.recipientLastname}</strong></td>
                        </tr>
                    </tbody>
                </div>
            </table>
            <div className="m-3">
                <div className="mt-2">
                    <p className="text-sucess"><small>Type in the reason for your {commentData.action==="REJECTED"?'rejection':'approval'}  here</small></p>
                    <input type="text" className="form-control" onChange={(e)=>setCommentData({...commentData,content:e.target.value})} />
                </div>
            </div>
            <div className="row mt-2 mb-3 mx-2">
                <div className="col">
                    <button className="btn btn-outline-primary" onClick={goBack}>Go back</button>
                </div>
                <div className="col">
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-primary" onClick={(e)=>handleSendComment(e)}>send feedback</button>
                    </div>
                </div>
            </div>
        </>
    )
}



export default TakeAction;