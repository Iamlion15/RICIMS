import {
    Modal,
    ModalBody,
    ModalHeader,
} from 'reactstrap';


const FailurePayment = ({ modalIsOpen, toggleModal }) => {
    return (
        <div>
            <Modal isOpen={modalIsOpen} toggle={toggleModal}>
                <ModalHeader>
                    <p className="text-danger">Failure info!</p>
                </ModalHeader>
                <ModalBody>
                    <div className='d-flex justify-content-center'>
                        <p className='font-monospace'>Failure in payment</p>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}

export default FailurePayment;
