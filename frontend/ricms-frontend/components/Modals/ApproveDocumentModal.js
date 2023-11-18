import { useState } from "react";
import { Modal, ModalHeader } from "reactstrap";


const ApproveDocumentModal = ({ modalIsOpen, toggleModal, data, confirmHandler }) => {
    const [activateConfrim, setActivateConfirm] = useState(false);
    const handleInput = (e) => {
        const input = e.target.value
        if (input === data.chemicalType) {
            setActivateConfirm(true)
        }
        else {
            setActivateConfirm(false)
        }
    }
    return (
        <Modal isOpen={modalIsOpen} toggle={() => toggleModal()} className="d-flex align-items-center justify-content-center" size='md'>
            <div>
                <ModalHeader>
                    <div className="m-2">
                        <h4 className="text-primary">Approve the document?</h4>
                    </div>
                </ModalHeader>
                <div>
                    <div className="m-3">
                        <span className="mb-2">This will approve : <strong> {data.firstname} {data.lastname}</strong> 's document</span>
                        <div className="mt-2">
                            <p className="text-sucess"><small>Type in<span className="text-primary"> {data.chemicalType} </span>to approve the document </small></p>
                            <input type="text" className="form-control" onChange={handleInput} />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end m-4">
                        <button type="button" className="btn btn-light mx-4" onClick={() => toggleModal()}>Cancel</button>
                        <button type="button" className={!activateConfrim ?"btn btn-light":"btn btn-danger"} disabled={!activateConfrim} onClick={confirmHandler}>Confirm</button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ApproveDocumentModal;