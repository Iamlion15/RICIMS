import { UncontrolledPopover, PopoverHeader, PopoverBody } from "reactstrap";
import { useState,useRef } from "react";
import { Modal, ModalHeader } from "reactstrap";
import AddComment from "../commentComponent.js/comment";
import TakeAction from "../commentComponent.js/actionComment";


const ApproveDocumentModal = ({ modalIsOpen, toggleModal, data, confirmHandler, commentData, setCommentData }) => {
    const [activateConfrim, setActivateConfirm] = useState(false);
    const [showTakeAction, setShowTakeAction] = useState(false)
    const [activateDocumentInfo, setActivateDocumentInfo] = useState(false)
    const [giveComment, setGiveComment] = useState(false);
    
    const handleInput = (e) => {
        const input = e.target.value
        if (input === data.chemicalType) {
            setActivateDocumentInfo(true)
        }
        else {
            setActivateDocumentInfo(false)
        }
    }
    const toggleActivateComment = () => {
        setGiveComment(!giveComment)
    }
    const toggleShowAction=()=>{
        setShowTakeAction(!showTakeAction)
    }
    const toggleActivateConfirm = (e) => {
        e.preventDefault()
        setActivateConfirm(true)
    }
    const handleReject=(e)=>{
        e.preventDefault();
        setCommentData({...commentData,action:"REJECTED"})
        setShowTakeAction(true);
    }
    const handleApprove=(e)=>{
        e.preventDefault();
        setCommentData({...commentData,action:"APPROVED"})
        setShowTakeAction(true)
    }
    return (
        <Modal isOpen={modalIsOpen} toggle={() => toggleModal()} className="d-flex align-items-center justify-content-center" size='md'>
            <div>
                <ModalHeader>
                    <div className="m-2">
                        <h4 className="text-primary">Approve the document?</h4>
                    </div>
                </ModalHeader>
                {!giveComment && !showTakeAction&&(<div>
                    {!activateDocumentInfo && <div className="m-3">
                        <span className="mb-2">This will approve : <strong> {data.firstname} {data.lastname}</strong> 's document</span>
                        <div className="mt-2">
                            <p className="text-sucess"><small>Type in<span className="text-primary"> {data.chemicalType} </span>to approve the document </small></p>
                            <input type="text" className="form-control" onChange={handleInput} />
                        </div>
                    </div>}
                    {activateDocumentInfo && (<div>
                        <table className="table table-borderless">
                            <thead>
                                <tr className="table-warning">
                                    <td>Description of the document to be approved</td>
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
                        <div className="mt-0 mx-3">
                            <div className="row">
                                <div className="col">
                                    <button className="btn btn-primary btn-sm" onClick={toggleActivateComment}>More Information</button>
                                </div>
                                <div className="col">
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-primary btn-sm" onClick={toggleActivateConfirm}>Next</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>)}
                    <div className="d-flex justify-content-end m-4">
                        <button type="button" className="btn btn-light mx-4" onClick={() => toggleModal()}>Cancel</button>
                        <button type="button" className={!activateConfrim ? "btn btn-light" : "btn btn-primary"} disabled={!activateConfrim} id="action">Confirm</button>
                    </div>
                    <div className="d-flex align-items-center justify-content-center mt-3">
                        <UncontrolledPopover
                            placement="top"
                            target="action"
                            trigger="legacy"
                        >
                            <PopoverHeader style={{backgroundColor:"#cfe2ff"}}>
                                <p className='d-flex justify-content-center'>Take action</p>
                            </PopoverHeader>
                            <PopoverBody>
                                <div className="btn-group">
                                    <button type="button" className="btn btn-danger" onClick={handleReject}>
                                        Reject    |
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={handleApprove}>
                                        Approve
                                    </button>
                                </div>

                            </PopoverBody>
                        </UncontrolledPopover>
                    </div>
                </div>)}
                {giveComment && (
                    <AddComment data={data} commentData={commentData} setCommentData={setCommentData} goBack={toggleActivateComment} />
                )}
                {showTakeAction&&(
                    <TakeAction data={data} commentData={commentData} setCommentData={setCommentData} goBack={toggleActivateComment} confirmHandler={confirmHandler}/>
                )}
            </div>
        </Modal>
    )
}

export default ApproveDocumentModal;