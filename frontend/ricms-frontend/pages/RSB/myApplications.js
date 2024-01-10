import { useState, useEffect, useRef } from "react";
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import axios from "axios";
import formatDateToCustomFormat from "@/helpers/dateFormatter";
import ApproveDocumentModal from "@/components/Modals/ApproveDocumentModal";
import DeleteModal from "@/components/Modals/deleteModal";
import ViewApplication from "./viewApplication";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const MyApplications = () => {
    const [data, setData] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    const [deleteModal, setDeleteModal] = useState(false)
    const [viewApp, setViewApp] = useState(false)
    const [search,setSearch]=useState("")
    const [viewDocumentApprove, setViewDocumentApprove] = useState(false)
    const [details, setDetails] = useState({})
    const [approveData, setApproveData] = useState({
        id: "",
        firstname: "",
        lastname: "",
        chemicalType: "",
        tsamples: "",
        psamples: "",
        submittedOn: ""
    })
    const [comment, setComment] = useState({
        recipientFirstname: "",
        recipientLastname: "",
        receiver: "",
        content: "",
        document: "",
        action: ""
    })
    const toastId = useRef(null)
    const toggleModal = () => {
        setModalIsOpen(!modalIsOpen);
    };
    const toggleApproveDocumentModal = () => {
        setViewDocumentApprove(!viewDocumentApprove)
    }
    const toggleDeleteModal = () => {
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
            const response = await axios.get("http://localhost:5000/api/document/getdocuments", config)
            const rabdata = [];
            console.log(response.data);
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].RAB_Approval.approved === true && response.data[i].RSB_Approval.approved === false) {
                    rabdata.push(response.data[i])
                }
            }
            setData(rabdata)
        } catch (error) {
            console.log(error)
        }
    }, [viewDocumentApprove, deleteModal])

    const checkStatus = (rabstatus, ricastatus, rsbstatus) => {
        if (rabstatus == "true" && ricastatus == "true" && rsbstatus == "true") {
            return "complete";
        }
        else {
            return "pending";
        }
    }
    const switchView = (detail) => {
        setDetails(detail)
        setViewApp(true)
    }
    const showDeleteModal = (id) => {
        setDeleteId(id)
        setDeleteModal(true)
    }
    const showApproveDocument = (currentDocument) => {
        console.log(currentDocument);
        setApproveData({
            id: currentDocument._id,
            firstname: currentDocument.owner.firstname,
            lastname: currentDocument.owner.lastname,
            chemicalType: currentDocument.document.psamples,
            tsamples: currentDocument.document.tsamples,
            submittedOn: formatDateToCustomFormat(currentDocument.createdAt)
        })
        setComment({
            recipientFirstname: currentDocument.RAB_Approval.reviewer.firstname,
            recipientLastname: currentDocument.RAB_Approval.reviewer.lastname,
            receiver: currentDocument.RAB_Approval.reviewer._id,
            document: currentDocument._id
        })
        setViewDocumentApprove(true)
    }
    const confirmHandler = async () => {
        const confirmData = {
            id: approveData.id,
            reviewer: "RSB",
            action: comment.action
        }
        toastId.current = toast.info("Loading............", {
            position: toast.POSITION.TOP_LEFT,
            autoClose: false
        })
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': JSON.parse(localStorage.getItem("token"))
            }
        }
        try {
            const response = await axios.post("http://localhost:5000/api/document/approve", confirmData, config)
            toast.update(toastId.current, { render: "Successfully sent action", type: toast.TYPE.SUCCESS, autoClose: 2000 })
            toggleApproveDocumentModal()

        } catch (error) {
            console.log(error)
            toast.update(toastId.current, { render: "Failure", type: toast.TYPE.ERROR, autoClose: 2000 })
        }
    }
    const filteredData = data.filter(searchedItem => searchedItem.owner.firstname.toLowerCase().startsWith(search.toLowerCase()));

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
                                        <th>PRODUCER</th>
                                        <th>CHEMICAL TYPE</th>
                                        <th>SUBMITTED ON</th>
                                        <th>STATUS</th>
                                        <th>ACTIONS</th>
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
                                                    {checkStatus(
                                                        info.RAB_Approval.approved,
                                                        info.RICA_Approval.approved,
                                                        info.RSB_Approval.approved
                                                    )}
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
                                                                onClick={() => showApproveDocument(info)}
                                                            >
                                                                Review Application
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                onClick={() => showDeleteModal(info._id)}
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
                        {viewDocumentApprove && <ApproveDocumentModal
                            modalIsOpen={viewDocumentApprove}
                            toggleModal={toggleApproveDocumentModal}
                            data={approveData}
                            commentData={comment}
                            setCommentData={setComment}
                            confirmHandler={confirmHandler}

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
                    viewDocumentApprove={viewDocumentApprove}
                    toggleApproveDocumentModal={toggleApproveDocumentModal}
                    approveData={approveData}
                    confirmHandler={confirmHandler}
                    showApproveDocument={showApproveDocument}
                />
            )}

        </>
    )
}

export default MyApplications;
