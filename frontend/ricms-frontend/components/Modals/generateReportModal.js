import { useState, useEffect } from "react";
import { Modal, ModalHeader } from "reactstrap";
import GeneratePDF from "@/helpers/pdf";
import axios from "axios";
import formatDateToCustomFormat from "@/helpers/dateFormatter";


const GenerateReportModal = ({ modalIsOpen, toggleModal, confirmHandler }) => {
    const [activateConfrim, setActivateConfirm] = useState(false);
    const [dateRange, setDateRange] = useState({
        startDate: "",
        endDate: "",
        role: ""
    });
    const [data, setData] = useState([]);
    const [printData, setPrintData] = useState({
        role: "",
        username: "",
        disclaimerText: ""
    })
    const [document, setDocument] = useState([])
    const [count, setCount] = useState("")
    const [activateDateChooser, setActivateDateChooser] = useState(false)
    const [category, setCategory] = useState("")
    const handleSelectChange = (e) => {
        const cat = e.target.value;
        setCategory(cat)
        if (cat === "Pending" || cat === "Reviewed") {
            setActivateDateChooser(true)
        }
        else {
            // setDateRange({startDate:""})
            setActivateDateChooser(false)
            console.log("date", !dateRange.startDate);
            console.log("activate", !activateDateChooser);
        }
    }
    const dateHandler = async (e) => {
        const date = e.target.value;
        const role = JSON.parse(localStorage.getItem("user")).role
        setDateRange({ ...dateRange, endDate: date, organisation: role });
    };

    useEffect(() => {
        findDocuments();
    }, [dateRange.endDate]);

    const findDocuments = async () => {
        if (category === "Reviewed") {
            const config = {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': JSON.parse(localStorage.getItem("token"))
                }
            }
            try {
                const response = await axios.post("http://localhost:5000/api/document/countdocumentsinrange", dateRange, config);
                setCount(response.data.count)
                setDocument(response.data.documents)
                if (response.data.count !== 0) {
                    setActivateConfirm(true)
                    const rol = JSON.parse(localStorage.getItem("user")).role
                    const usernam = JSON.parse(localStorage.getItem("user")).username
                    console.log("here", rol);
                    if (rol === "RAB") {
                        setPrintData({
                            role:"RWANDA AGRICULTURAL BOARD",
                            username: usernam,
                            disclaimerText: "Authority is hereby granted by Rwanda Agricultural Board(RAB), the management of the system of RAB"
                        })
                    }
                    else if (rol === "RSB") {
                        setPrintData({
                            role: "RWANDA STANDARD BOARD",
                            username: usernam,
                            disclaimerText: "Authority is hereby granted by Rwanda Standard Board(RSB), the management authority of RSB"
                        })
                    }
                    else {
                        if (rol === "RICA") {
                            setPrintData({
                                role: "RWANDA INSPECTORATE, COMPETITION AND CONSUMER PROTECTION AUTHORITY",
                                username: usernam,
                                disclaimerText: "Authority is hereby granted by Rwanda Insepctorate Authority(RICA) , the management authority of RICA"
                            })
                        }
                    }
                    setData(response.data.documents)
                }
                else {
                    setActivateConfirm(false)
                }
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        else {
            if (category === "Pending") {
                const config = {
                    headers: {
                        'Content-Type': "application/json",
                        'Authorization': JSON.parse(localStorage.getItem("token"))
                    }
                }
                try {
                    const response = await axios.post("http://localhost:5000/api/document/countpendingdocumentsinrange", dateRange, config);
                    setCount(response.data.count)

                    if (response.data.count !== 0) {
                        setActivateConfirm(true)
                        const rol = JSON.parse(localStorage.getItem("user")).role
                        const usernam = JSON.parse(localStorage.getItem("user")).username
                        console.log("here", rol);
                        if (rol === "RAB") {
                            setPrintData({
                                role: rol+" PENDING",
                                username: usernam,
                                disclaimerText: "Authority is hereby granted by Rwanda Agriculture Board(RAB) the management authority of RAB"
                            })
                        }
                        else if (rol === "RSB") {
                            setPrintData({
                                role:rol+" PENDING",
                                username: usernam,
                                disclaimerText: "Authority is hereby granted by Rwanda Standard Board(RAB) the management authority of RSB"
                            })
                        }
                        else {
                            if (rol === "RICA") {
                                setPrintData({
                                    role: rol+" PENDING",
                                    username: usernam,
                                    disclaimerText: "Authority is hereby granted by Rwanda Insepctorate Authority(RICA) the management authority of RICA"
                                })
                            }
                        }
                        setData(response.data.documents)
                    }
                    else {
                        setActivateConfirm(false)
                    }
                    console.log(response.data)
                } catch (error) {
                    console.log(error);
                }
            }
        }

    }
    useEffect(async () => {
        setDateRange({ startDate: "", endDate: "" })
    }, [])
    return (
        <Modal isOpen={modalIsOpen} toggle={() => toggleModal()} className="d-flex align-items-center justify-content-center" size='md'>
            <div>
            <div className='row mt-4'>
                    <div className='col-6'>
                        <div className='alert mx-4' style={{ backgroundColor: "#EBF3FB" }}>
                            <span style={{ color: "#0068D1" }}>
                                Details review report
                            </span>
                        </div>
                    </div>
                    <div className='col-6'>
                        <div className='d-flex justify-content-end mt-3' style={{ marginRight: "50px" }}>
                            <span style={{ cursor: "pointer", fontWeight: "bolder" }} onClick={() => toggleModal()} >X</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="d-flex flex-column">
                        <div className="mx-5 px-5 ">
                            <p>choose category</p>
                            <select className="form-select form-select-sm" onChange={handleSelectChange}>
                                <option > Choose</option>
                                <option value="Pending" selected={category === "Pending"}>Pending</option>
                                <option value="Reviewed" selected={category === "Reviewed"}>Reviewed</option>
                            </select>
                        </div>
                        <div className="d-flex flex-row justify-content-between mx-5">
                            <div className="mx-2 mt-3">
                                <small className="d-block text-uppercase font-weight-bold mb-3">
                                    Start Date
                                </small>
                                <input
                                    type="date"
                                    className="form-control"
                                    placeholder="Date Picker Here"
                                    value={dateRange.startDate}
                                    onChange={(e) =>
                                        setDateRange({ ...dateRange, startDate: e.target.value })
                                    }
                                    disabled={!activateDateChooser }
                                />
                            </div>
                            <div className="mx-3 mt-3">
                                <small className="d-block text-uppercase font-weight-bold mb-3">
                                    End Date
                                </small>
                                <input
                                    type="date"
                                    className="form-control"
                                    placeholder="Date Picker Here"
                                    value={dateRange.endDate}
                                    onChange={dateHandler}
                                    min={dateRange.startDate} 
                                    disabled={!dateRange.startDate || !activateDateChooser } 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className=" d-flex justify-content-start m-4">
                                <p> count : {count}</p>
                            </div>
                        </div>
                        <div className="col">
                            <div className=" d-flex justify-content-end m-4">
                                <button type="button" className="btn btn-light mx-4" onClick={() => toggleModal()}>Cancel</button>
                                <button type="button" className={!activateConfrim ? "btn btn-light" : "btn btn-danger"} disabled={!activateConfrim} onClick={() => GeneratePDF(data, printData)}>Print</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default GenerateReportModal;