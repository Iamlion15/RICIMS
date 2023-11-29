import { useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AddProduct = () => {
    const [data, setData] = useState({
        companyName: "",
        email: "",
        phone: "",
        psamples: "",
        tsamples: "",
        file: ""
    });
    const toastId = useRef(null)
    const linearGradientBackground = {
        background: 'linear-gradient(195deg, #49a3f1, #0057A3)',
        borderColor: 'linear-gradient(195deg, #49a3f1, #0057A3)',
        width: "100%"
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        toastId.current = toast.info("Loading............", {
            position: toast.POSITION.TOP_LEFT,
            autoClose: false
        })
        const formdata = new FormData();
        formdata.append('companyName', data.companyName)
        formdata.append('email', data.email);
        formdata.append('phone', data.phone);
        formdata.append('psamples', data.psamples);
        formdata.append('tsamples', data.tsamples)
        formdata.append('file', data.file)
        const config = {
            headers: {
                'Content-Type': "multipart/form-data",
                'Authorization': JSON.parse(localStorage.getItem("token"))
            }
        }
        try {
            const response = await axios.post("http://localhost:5000/api/document/save", formdata, config)
            toast.update(toastId.current, { render: "Successfully sent data", type: toast.TYPE.SUCCESS, autoClose: 2000 })

        } catch (error) {
            console.log(error)
            toast.update(toastId.current, { render: "Failure", type: toast.TYPE.ERROR, autoClose: 2000 })
        }
    }

    return (
        <>
            <div className="row font-monospace">
                <div className="col-5 mx-3">
                    {/* Producer Details */}
                    <div className="d-flex flex-column">
                        <div className="d-flex justify-content-center">
                            <h3 className="lead">Producer details</h3>
                        </div>
                        <hr />
                        <form className="mt-3">
                            <div className="form-group">
                                <label htmlFor="company">NAME OF THE COMPANY</label>
                                <input
                                    type="text"
                                    className="form-control my-3"
                                    id="company"
                                    placeholder="Enter company name"
                                    value={data.companyName}
                                    required
                                    onChange={(e) => setData({ ...data, companyName: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">EMAIL OF THE COMPANY</label>
                                <input
                                    type="email"
                                    className="form-control my-3"
                                    id="email"
                                    placeholder="Email address"
                                    value={data.email}
                                    required
                                    onChange={(e) => setData({ ...data, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="phone">PHONE NUMBER</label>
                                <input
                                    type="text"
                                    className="form-control my-3"
                                    id="phone"
                                    placeholder="Phone number"
                                    value={data.phone}
                                    required
                                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                                />
                            </div>
                            <div className='mt-auto mb-3'>
                                <button className='btn text-white' style={linearGradientBackground} onClick={handleSubmit}>
                                    <strong className="mx-2">SAVE DOCUMENT</strong>
                                    <i className="bi bi-cloud-plus"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-5">
                    {/* Sample Information */}
                    <div className="d-flex flex-column">
                        <div className="d-flex justify-content-center">
                            <h3 className="lead">Sample information</h3>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-6 mt-3">
                                <div className="form-group">
                                    <label htmlFor="psample">sample type</label>
                                    <input
                                        type="text"
                                        className="form-control my-3"
                                        id="psample"
                                        placeholder="sample type"
                                        value={data.psamples}
                                        required
                                        onChange={(e) => setData({ ...data, psamples: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="col-6">
                                {/* Additional content for the other col-6 */}
                                {/* You can add more input fields or content here */}
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="wsample">Total number of samples</label>
                            <input
                                type="number"
                                className="form-control my-3"
                                id="wsample"
                                placeholder="Total number of samples"
                                value={data.tsamples}
                                required
                                onChange={(e) => setData({ ...data, tsamples: e.target.value })}
                            />
                        </div>
                        <div className="input-group mb-3 my-3">
                            <input type="file" className="form-control" id="upload" onChange={(e) => setData({ ...data, file: e.target.files[0] })} />
                            <label className="input-group-text" htmlFor="upload">Upload</label>
                        </div>
                    </div>
                </div>
                <div>
                    <ToastContainer/>
                </div>
            </div>
        </>
    );
};

export default AddProduct;
