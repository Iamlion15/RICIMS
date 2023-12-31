import { useState, useEffect, useRef } from "react";
import axios from "axios";
import formatDateToCustomFormat from "@/helpers/dateFormatter";


const PaymentHistory = () => {
    const [data, setData] = useState([])

    useEffect(async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': JSON.parse(localStorage.getItem("token"))
            }
        }
        try {
            const response = await axios.get("http://localhost:5000/api/document/paymenthistory", config)
            console.log(response.data);
            setData(response.data)
        } catch (error) {
            console.log(error)
        }
    }, [])


    return (
        <>
            <div className="mx-4 font-monospace">
                <p><strong> Approved Applications </strong></p>
                <div className="card rounded-3 shadow-sm">
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
                        <table className="table mt-5">
                            <thead>
                                <tr>
                                    <th>NO.</th>
                                    <th>COMPANY NAME</th>
                                    <th>CHEMICALTYPE</th>
                                    <th>SUBMITTED ON</th>
                                    <th>AMOUNT PAYED</th>
                                    <th>PAYED ON</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((info, index) => {
                                    return (
                                        <tr key={info._id}>
                                            <td>{index + 1}</td> {/* Display a row number */}
                                            <td>{info.document.document.companyName}</td>
                                            <td>{info.document.document.psamples}</td>
                                            <td>{formatDateToCustomFormat(info.document.createdAt)}</td>
                                            <td>{info.amount} RWF</td>
                                            <td>{formatDateToCustomFormat(info.createdAt)}</td>
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

export default PaymentHistory;
