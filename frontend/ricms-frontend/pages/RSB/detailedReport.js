import { useState, useEffect, useRef } from "react";
import axios from "axios";
import formatDateToCustomFormat from "@/helpers/dateFormatter";
import { generatePdf } from "@/helpers/detailedReportPDF";


const DetailedReport = () => {
    const [data, setData] = useState([])
    const [search, setSearch] = useState("")
    const [user, setUser] = useState("")
    useEffect(async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': JSON.parse(localStorage.getItem("token"))
            }
        }
        try {
            setUser(JSON.parse(localStorage.getItem("loggedInUser")))
            const response = await axios.get("http://localhost:5000/api/document/rsb/detailed/report", config)
            console.log(response.data);
            setData(response.data)
        } catch (error) {
            console.log(error)
        }
    }, [])

    const printReport = async (document) => {
        await generatePdf(document, user)
    }
    const filteredData = data.filter(searchedItem => searchedItem.document.companyName.toLowerCase().startsWith(search.toLowerCase()));
    return (
        <>
            <div className="mx-4 font-monospace">
                <p><strong> Detailed report </strong></p>
                <div className="card rounded-4 shadow-sm">
                    <div className="mx-4 mt-2">
                        <div className="d-flex justify-content-end">
                            <div className="mx-2 mt-2 mb-2">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="bi bi-search"></i></span>
                                    </div>
                                    <input type="text" className="form-control"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search..." />
                                </div>
                            </div>
                        </div>
                        <table className="table mt-5">
                            <thead>
                                <tr>
                                    <th>NO.</th>
                                    <th>COMPANY NAME</th>
                                    <th>CHEMICAL TYPE</th>
                                    <th>SUBMITTED BY</th>
                                    <th>SUBMITTED ON</th>
                                    <th>DONE ON</th>
                                    <th>STATUS</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((info, index) => {
                                    return (
                                        <tr key={info._id}>
                                            <td>{index + 1}</td> {/* Display a row number */}
                                            <td>{info.document.companyName}</td>
                                            <td>{info.document.psamples}</td>
                                            <td>{info.owner.firstname} {info.owner.lastname}</td>
                                            <td>{formatDateToCustomFormat(info.createdAt)}</td>
                                            <td>{formatDateToCustomFormat(info.RAB_Approval.timeOfApproval)}</td>
                                            <td>
                                                {info.RAB_Approval.approved ? (<span className="badge rounded-pill bg-success">Approved</span>) :
                                                    (<span className="badge rounded-pill bg-danger">Rejected</span>)
                                                }
                                            </td>
                                            <th><button className="btn btn-outline-primary" onClick={() => printReport(info)}>
                                                <div className="d-flex flex-row">
                                                    <i className="bi bi-download" style={{ marginRight: "10px" }}></i>DOWNLOAD
                                                </div>
                                            </button></th>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailedReport;
