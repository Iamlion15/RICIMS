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


const MyApplications = () => {
    const [data, setData] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [deleteId,setDeleteId]=useState('')
    const [deleteModal, setDeleteModal] = useState(false)
    const [viewApp, setViewApp] = useState(false)
    const [viewDocumentUpdate, setViewDocumentUpdate] = useState(false)
    const [details, setDetails] = useState({})
    const [documentToUpdate, setDocumentToUpdate] = useState({})
    const [updateData, setUpdateData] = useState({
        id: "",
        companyName: "",
        phone: "",
        email: "",
        tsamples: "",
        psamples: "",
        fileLocation: ""
    })
    const toastId = useRef(null)
    const toggleModal = () => {
        setModalIsOpen(!modalIsOpen);
    };
    const toggleUpdateDocumentModal = () => {
        setViewDocumentUpdate(!viewDocumentUpdate)
    }
    const toggleDeleteModal=()=>{
        setDeleteModal(!deleteModal)
    }
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
                if(response.data[i].status==="pending"){
                    producerdata.push(response.data[i])
                }
            }
            setData(producerdata)
        } catch (error) {
            console.log(error)
        }
    }, [viewDocumentUpdate,deleteModal])

    const switchView = (detail) => {
        setDetails(detail)
        setViewApp(true)
    }
    const showDeleteModal=(id)=>{
        setDeleteId(id)
        setDeleteModal(true)
    }
    const showUpdateDocument = (currentDocument) => {
        console.log("clicked");
        setUpdateData({
            id: currentDocument._id,
            companyName: currentDocument.document.companyName,
            email: currentDocument.document.email,
            phone: currentDocument.document.phone,
            tsamples: currentDocument.document.tsamples,
            psamples: currentDocument.document.psamples,
            fileLocation: currentDocument.document.fileLocation
        })
        setViewDocumentUpdate(true)
    }
    const updateHandler = async (e) => {
        e.preventDefault();
        toastId.current = toast.info("Loading............", {
            position: toast.POSITION.TOP_LEFT,
            autoClose: false
        })
        const formData = new FormData();
        formData.append("id", updateData.id);
        formData.append("companyName", updateData.companyName);
        formData.append("email", updateData.email);
        formData.append("psamples", updateData.psamples);
        formData.append("phone", updateData.phone);
        formData.append("tsamples", updateData.tsamples);
        formData.append("fileLocation", updateData.fileLocation)
        const config = {
            headers: {
                'Content-Type': "multipart/form-data",
                'Authorization': JSON.parse(localStorage.getItem("token"))
            }
        }
        try {
            const response = await axios.post("http://localhost:5000/api/document/update", formData, config)
            toast.update(toastId.current, { render: "Successfully sent data", type: toast.TYPE.SUCCESS, autoClose: 2000 })
            toggleUpdateDocumentModal()

        } catch (error) {
            console.log(error)
            toast.update(toastId.current, { render: "Failure", type: toast.TYPE.ERROR, autoClose: 2000 })
        }
    }

    return (
        <>
            {!viewApp && (
                <div className="mx-4 font-monospace">
                    <p><strong> All Applications</strong></p>
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
                                        <th>CHEMICAL TYPE</th>
                                        <th>TOTAL SAMPLES</th>
                                        <th>SUBMITTED ON</th>
                                        <th>STATUS</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((info, index) => {
                                        return (
                                            <tr key={info._id}>
                                                <td>{index + 1}</td> {/* Display a row number */}
                                                <td>{info.document.psamples}</td>
                                                <td>{info.document.tsamples}</td>
                                                <td>{formatDateToCustomFormat(info.document.createdAt)}</td>
                                                <td>
                                                   {info.status}
                                                </td>
                                                <td className="d-flex justify-content-center">
                                                    <UncontrolledDropdown>
                                                        <DropdownToggle
                                                            role="button"
                                                            size="sm"
                                                            color=""
                                                            onClick={(e) => e.preventDefault()}
                                                        >
                                                            <i class="bi bi-three-dots-vertical"></i>
                                                        </DropdownToggle>
                                                        <DropdownMenu className="dropdown-menu-arrow" right>
                                                            <DropdownItem
                                                                onClick={() => showUpdateDocument(info)}
                                                            >
                                                                update

                                                            </DropdownItem>
                                                            <DropdownItem
                                                            onClick={()=>showDeleteModal(info._id)}
                                                            >
                                                                delete
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                onClick={() => switchView(info)}>
                                                                View application
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div>
                        {viewDocumentUpdate && <UpdateDocumentModal
                            modalIsOpen={viewDocumentUpdate}
                            toggleModal={toggleUpdateDocumentModal}
                            data={updateData}
                            setData={setUpdateData}
                            updateHandler={updateHandler}

                        />}
                    </div>
                    {deleteModal && (
                        <DeleteModal 
                        toggleModal={setDeleteModal}
                        modalIsOpen={deleteModal}
                        id={deleteId}
                        ToastContainer={ToastContainer}
                        />
                    )}
                    <div>
                        <ToastContainer />
                    </div>
                </div>
            )}
            {viewApp && (
                <ViewApplication document={details}
                    setViewApp={setViewApp}
                />
            )}

        </>
    )
}

export default MyApplications;
