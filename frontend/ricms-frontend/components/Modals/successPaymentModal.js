import React from 'react';
import {
    Modal,
    ModalBody,
    ModalHeader,
    Button
} from 'reactstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const SuccessfullPayment = ({ modalIsOpen, toggleModal }) => {
    return (
        <div>
            <Modal isOpen={modalIsOpen} toggle={toggleModal} className="modal-success">
            <div className='row mt-4'>
                    <div className='col-6'>
                        <div className='alert mx-4' style={{ backgroundColor: "#EBF3FB" }}>
                            <span style={{ color: "#0068D1" }}>
                                Successfull paid
                            </span>
                        </div>
                    </div>
                    <div className='col-6'>
                        <div className='d-flex justify-content-end mt-3' style={{ marginRight: "50px" }}>
                            <span style={{ cursor: "pointer", fontWeight: "bolder" }} onClick={() => toggleModal()} >X</span>
                        </div>
                    </div>
                </div>
                <ModalBody className="text-center">
                    <i className="bi bi-check-circle-fill text-success mb-3" style={{ fontSize: '3rem' }}></i>
                    <p className='font-monospace'>Payment was successfully processed!</p>
                    <Button color="success" onClick={toggleModal} className="mt-3">
                        <i className="bi bi-hand-thumbs-up-fill mr-2"></i>
                        Close
                    </Button>
                </ModalBody>
            </Modal>
        </div>
    );
}

export default SuccessfullPayment;
