import { useState, useEffect, useRef } from "react";
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import axios from "axios";
import formatDateToCustomFormat from "@/helpers/dateFormatter";
import ViewApplication from "./viewApplication";
import UpdateDocumentModal from "@/components/Modals/updateDocumentModal";
import DeleteModal from "@/components/Modals/deleteModal";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const ApprovedApplications = () => {
    const [data, setData] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [deleteId,setDeleteId]=useState('')
    const [deleteModal, setDeleteModal] = useState(false)
    const [viewApp, setViewApp] = useState(false)
    const [search,setSearch]=useState("")
    const [viewDocumentUpdate, setViewDocumentUpdate] = useState(false)
    const [details, setDetails] = useState({})
    const toastId = useRef(null)
    useEffect(async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': JSON.parse(localStorage.getItem("token"))
            }
        }
        try {
            const response = await axios.get("http://localhost:5000/api/document/getall", config)
            console.log(response.data);
            const producerdata=[];
            for(let i=0;i<response.data.length;i++){
                if(response.data[i].status==="approved" && response.data[i].payed===false){
                    producerdata.push(response.data[i])
                }
            }
            setData(producerdata)
        } catch (error) {
            console.log(error)
        }
    }, [])

    const payHandler = async (documentName,documentId) => {
        toastId.current = toast.info("Loading............", {
            position: toast.POSITION.TOP_LEFT,
            autoClose: false
        })
        const payData={
            id:documentId,
            documentName:documentName + " document request approval",
            amount:20000
        }
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': JSON.parse(localStorage.getItem("token"))
            }
        }
        try {
            const response = await axios.post("http://localhost:5000/api/document/pay", payData, config)
            toast.update(toastId.current, { render: "Successfully sent data", type: toast.TYPE.SUCCESS, autoClose: 2000 })
            window.location.href = response.data.url;
        } catch (error) {
            console.log(error)
            toast.update(toastId.current, { render: "Failure", type: toast.TYPE.ERROR, autoClose: 2000 })
        }
    }
    const filteredData = data.filter(searchedItem => searchedItem.owner.firstname.toLowerCase().startsWith(search.toLowerCase()));
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
                                        <th>PAYEE</th>
                                        <th>CHEMICAL TYPE</th>
                                        <th>SUBMITTED ON</th>
                                        <th>PAY</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((info, index) => {
                                        return (
                                            <tr key={info._id}>
                                                <td>{index + 1}</td> {/* Display a row number */}
                                                <td>{info.owner.firstname} {info.owner.lastname}</td>
                                                <td>{info.document.tsamples}</td>
                                                <td>{formatDateToCustomFormat(info.document.createdAt)}</td>
                                                <td>
                                                   <button className="btn btn-outline-primary" onClick={()=>payHandler(info.document.companyName,info._id)}>Pay 20000 RWF</button>
                                                </td>
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

export default ApprovedApplications;
