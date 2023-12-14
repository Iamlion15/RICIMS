import {
    Modal,
    ModalBody,
    ModalHeader,
} from 'reactstrap';


const SuccessfullPayment = ({ modalIsOpen, toggleModal }) => {
    return (
        <div>
            <Modal isOpen={modalIsOpen} toggle={toggleModal}>
                <ModalHeader>
                    <p>Success info!</p>
                </ModalHeader>
                <ModalBody>
                    <div className='d-flex justify-content-center'>
                        <p className='font-monospace'>successfully payed</p>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}

export default SuccessfullPayment;
