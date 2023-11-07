import { useState, } from "react";
import { Modal, ModalFooter } from "reactstrap";



const UpdateDocumentModal = ({ modalIsOpen, toggleModal, data, setData, updateHandler }) => {
    const [showUpload, setShowUpload] = useState(false);
    return (
        <Modal isOpen={modalIsOpen} toggle={() => toggleModal()} className="d-flex align-items-center justify-content-center" size='lg'>
            <div>
                <div className="m-4">
                    <h3 className="text-primary">Edit document</h3>
                </div>
                <form className="m-4">
                    <div className="row">
                        <div className="col">
                            <div className="form-floating">
                                <input type="text"
                                    className="form-control"
                                    id="fname"
                                    value={data.companyName}
                                    onChange={(e) => setData({
                                        ...data,
                                        companyName: e.target.value

                                    })}
                                />
                                <label htmlFor="cname">Name of the company</label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-floating">
                                <input type="email"
                                    className="form-control"
                                    id="email"
                                    value={data.email}
                                    onChange={(e) => setData({
                                        ...data,
                                        email: e.target.value
                                    })}
                                />
                                <label htmlFor="email">Email of the company</label>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col">
                            <div className="form-floating">
                                <input type="phone"
                                    className="form-control"
                                    id="email"
                                    value={data.phone}
                                    onChange={(e) => setData({
                                        ...data,
                                        phone: e.target.value

                                    })}
                                />
                                <label htmlFor="phone">Phone number</label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-floating">
                                <input type="text"
                                    className="form-control"
                                    id="nsample"
                                    value={data.psamples}
                                    onChange={(e) => setData({
                                        ...data,
                                        psamples: e.target.value
                                    })}
                                />
                                <label htmlFor="nsample">sample type</label>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col">
                            <div className="form-floating">
                                <input type="number"
                                    className="form-control"
                                    id="tsamples"
                                    value={data.tsamples}
                                    onChange={(e) => setData({
                                        ...data,
                                        tsamples: e.target.value
                                    })}
                                />
                                <label htmlFor="tsamples">Total number of samples</label>
                            </div>
                        </div>
                        <div className="col">
                            <div>
                                {showUpload && (<div className="input-group">
                                    <input type="file" className="form-control" id="upload"
                                        onChange={(e) => setData({
                                            ...data,
                                            fileLocation: e.target.files[0]
                                        })} />
                                </div>)}
                                {!showUpload && (
                                    <div className="d-flex flex-row" >
                                        <i class="bi bi-filetype-pdf mx-3"></i>
                                        <p className="text-secondary mx-4" style={{ textDecoration: 'underline' }} ><strong>Supporting document</strong></p>
                                        <button className="btn btn-sm btn-warning" onClick={() => setShowUpload(true)}>remove</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <ModalFooter className="m-4">
                        <button type="button" class="btn btn-outline-danger" onClick={() => toggleModal()}>Cancel</button>
                        <button type="button" class="btn btn-success" onClick={updateHandler}>Update</button>
                    </ModalFooter>
                </form>
            </div>
        </Modal>
    )
}



export default UpdateDocumentModal;