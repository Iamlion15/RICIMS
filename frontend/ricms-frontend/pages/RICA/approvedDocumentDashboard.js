import { useState, useEffect } from "react";
import axios from "axios";
import formatDateToCustomFormat from "@/helpers/dateFormatter";
import ApprovedDocumentDetail from "@/components/infoComponents/ApprovedDocumentDetail";
const ApprovedDocuments = () => {
    const [data, setData] = useState([])
    const [showDetails, setShowDetails] = useState(false)
    const [document, setDocument] = useState()
    const showDetailsOfApproval = (info) => {
        setDocument(info)
        setShowDetails(true);
    }
    const toggleShowDetails = () => {
        console.log(showDetails);
        setShowDetails(!showDetails)
    }
    useEffect(async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': JSON.parse(localStorage.getItem("token"))
            }
        }
        try {
            const response = await axios.get("http://localhost:5000/api/document/getdocuments", config)
            const rabdata = [];
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].RAB_Approval.approved === true && response.data[i].RSB_Approval.approved === true && response.data[i].RICA_Approval.approved === true) {
                    rabdata.push(response.data[i])
                }
            }
            setData(rabdata)
        } catch (error) {
            console.log(error)
        }
    }, [])
    return (
        <>
            <div className="mx-4 font-monospace">
                <p><strong> All approved applications</strong></p>
                {!showDetails && (<div className="card rounded-3 shadow-sm">
                    <div className="mx-4 mt-2">
                        <div className="d-flex justify-content-end">
                            <div className="mx-2 mt-2 mb-2">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="bi bi-search"></i></span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="Search..." />
                                </div>
                            </div>
                        </div>
                        <table className="table table-hover mt-5">
                            <thead>
                                <tr className="table-primary">
                                    <th>NO.</th>
                                    <th>PRODUCER</th>
                                    <th>CHEMICAL TYPE</th>
                                    <th>APPROVED ON</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((info, index) => {
                                    return (
                                        <tr key={info._id} style={{ cursor: "pointer" }} onClick={()=>showDetailsOfApproval(info)}>
                                            <td>{index + 1}</td> {/* Display a row number */}
                                            <td>{info.owner.firstname} {info.owner.lastname}</td>
                                            <td>{info.document.psamples}</td>
                                            <td>{formatDateToCustomFormat(info.RAB_Approval.timeOfApproval)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>)}
                {showDetails && (
                    <ApprovedDocumentDetail
                        data={document}
                        goBack={toggleShowDetails}
                    />
                )}
            </div>
        </>
    )
}

export default ApprovedDocuments;
