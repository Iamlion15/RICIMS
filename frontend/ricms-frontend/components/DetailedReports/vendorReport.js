import { useState, useEffect } from "react";
import axios from "axios";
import VendorGeneratePDF from "@/helpers/vendorReportPdf";


const VendorReport = () => {
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
        disclaimerText: "",
        report: ""
    })
    const [itemType, setItemType] = useState([])
    const [activateDateChooser, setActivateDateChooser] = useState(false)
    const [itemChose, setItemChose] = useState('')
    const [category, setCategory] = useState("")
    const handleSelectChange = (e) => {
        const cat = e.target.value;
        setCategory(cat)
        if (cat === "Pending" || cat === "Reviewed") {
            setActivateDateChooser(true)
        }
        else {
            setActivateDateChooser(false)
        }
    }
    const dateHandler = async (e) => {
        const date = e.target.value;
        const role = JSON.parse(localStorage.getItem("user")).role
        setDateRange({ ...dateRange, endDate: date, organisation: role });
        setActivateConfirm(true)
    };
    const GenerateReport = async (value) => {

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(localStorage.getItem('token'))
            }
        };
        const sentData = {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            organization: JSON.parse(localStorage.getItem('loggedInUser')).role,
            itemChose: value,
            category: category
        }
        try {
            const response = await axios.post(
                'http://localhost:5000/api/document/generate-report',
                sentData,
                config
            );
            setData(response.data);
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };
    useEffect(async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': JSON.parse(localStorage.getItem("token"))
            }
        }
        try {
            const response = await axios.get("http://localhost:5000/api/document/getitemtypes", config)
            setItemType(response.data)
        } catch (error) {
            console.log(error)
        }
    }, [])
    const handleItemChoose=(e)=>{
        const value=e.target.value;
        setItemChose(value)
        GenerateReport(value);
        setActivateConfirm(true)
        
    }
    useEffect(() => {
        const rol = JSON.parse(localStorage.getItem('loggedInUser')).role
        const usernam = JSON.parse(localStorage.getItem('user')).username     

        if (rol === "RAB") {
            setPrintData({
                ...printData,role: rol,
                username: usernam,
                disclaimerText: "Authority is hereby granted by Rwanda Agriculture Board(RAB) the management authority of RAB",
                report:category
            })
        }
        else if (rol === "RSB") {
            setPrintData({
                ...printData,role: rol,
                username: usernam,
                disclaimerText: "Authority is hereby granted by Rwanda Standard Board(RAB) the management authority of RSB",
                report:category
            })
        }
        else {
            if (rol === "RICA") {
                setPrintData({
                    ...printData,role: rol,
                    username: usernam,
                    disclaimerText: "Authority is hereby granted by Rwanda Insepctorate Authority(RICA) the management authority of RICA",
                    report:category
                })
            }
        }
        console.log(printData);
    }, [category])

    return (
        <div className="my-5 container font-monospace">
            <div className="d-flex justify-content-center">
                <div className="d-flex flex-column">
                    <div className="m-2">
                        <h4 className="text-primary">Detailed Vendor Report</h4>
                    </div>
                    <div className="mx-3 mb-3">
                        <label className="form-label">Choose category</label>
                        <select
                            className="form-select form-select-sm"
                            onChange={handleSelectChange}
                            style={{ width: "200px" }}
                            value={category}
                        >
                            <option value="Choose">Choose</option>
                            <option value="Pending">Pending</option>
                            <option value="Reviewed">Reviewed</option>
                        </select>
                    </div>
                    <div className="d-flex flex-row mb-3">
                        <div className="mx-2 mt-3">
                            <label className="form-label">Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={dateRange.startDate}
                                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                                disabled={!activateDateChooser}
                            />
                        </div>
                        <div className="mx-3 mt-3">
                            <label className="form-label">End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={dateRange.endDate}
                                onChange={dateHandler}
                                min={dateRange.startDate}
                                disabled={!dateRange.startDate}
                            />
                        </div>
                    </div>
                    <div className="mx-3 mb-3">
                        <label className="form-label">Choose Item types</label>
                        <select
                            className="form-select form-select-sm"
                            onChange={handleItemChoose}
                            style={{ width: "200px" }}
                            value={itemChose}
                        >
                            <option value="All">All</option>
                            {itemType.map((items) => (
                                <option value={items}>{items}</option>
                            ))}

                        </select>
                    </div>
                    <div className="row mt-3">
                        <div className="col">
                            <button
                                type="button"
                                className={`btn ${!activateConfrim ? "btn-light" : "btn-primary"}`}
                                disabled={!activateConfrim}
                                onClick={()=>VendorGeneratePDF(data,printData)}
                            >
                                Generate Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorReport;