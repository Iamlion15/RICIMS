import { useEffect, useState } from 'react';
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import UpdateUserModal from '../Modals/updateUserModal';
import ChangeUserPasswordModal from '../Modals/changePasswordModal';
import GenerateReportModal from '../Modals/generateReportModal';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";


const HeaderComponent = ({ page, logout }) => {
    const [user, setUser] = useState('')
    const [data, setData] = useState({
        firstname: "",
        lastname: "",
        nID: "",
        email: "",
    })
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')))
        const userData = JSON.parse(localStorage.getItem("loggedInUser"));
        setData({
            firstname: userData.firstname,
            lastname: userData.lastname,
            nID: userData.nID,
            email: userData.email
        })
    }, [])
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const toggleModal = () => {
        setModalIsOpen(!modalIsOpen);
    };
    const [modalChangePasswordIsOpen, setChangePasswordModalIsOpen] = useState(false)
    const toggleChangePasswordModal = () => {
        setChangePasswordModalIsOpen(!modalChangePasswordIsOpen);
    };
    const [reportModal, setReportModal] = useState(false)
    const toggleReportModal = () => {
        setReportModal(!reportModal);
    };
    const updateHandler = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': JSON.parse(localStorage.getItem("token"))
            }
        }
        try {
            const response = await axios.post("http://localhost:5000/api/user/update", data, config)
            toast.success("Succesfully updated user !", {
                position: toast.POSITION.BOTTOM_LEFT
            });
            localStorage.setItem("loggedInUser", JSON.stringify(response.data.updatedUser))
            localStorage.setItem("user", JSON.stringify(response.data.userInformation))
            setUser(JSON.parse(localStorage.getItem('user')))
            toggleModal()
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <header className="border-bottom shadow font-monospace" style={{ width: "100%" }}>
            <div className="container pt-1">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <p className='mt-2'> {page}</p>
                    </div>
                    <UncontrolledDropdown group>
                        <div className='mt-2' style={{marginRight:"15px"}}>
                            {user.role}
                        </div>
                        <p className='mt-2'>{user.username}</p>
                        <DropdownToggle
                            caret
                            color='default'
                        />
                        <DropdownMenu className='shadow rounded-3'>
                            <DropdownItem onClick={toggleModal}>
                                Update profile
                            </DropdownItem>
                            <DropdownItem onClick={toggleChangePasswordModal}>
                                Change passwords
                            </DropdownItem>
                            {(user.role === "RAB" || user.role === "RSB" || user.role === "RICA") && (
                                <DropdownItem onClick={toggleReportModal}>
                                    Review report
                                </DropdownItem>
                            )}
                            <DropdownItem divider />
                            <DropdownItem
                                onClick={() => logout()}
                            >
                                Logout
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
                <div>
                    <UpdateUserModal
                        modalIsOpen={modalIsOpen}
                        toggleModal={toggleModal}
                        data={data}
                        setData={setData}
                        updateHandler={updateHandler}
                    />
                </div>
                <div>
                    <ChangeUserPasswordModal
                        modalIsOpen={modalChangePasswordIsOpen}
                        toggleModal={toggleChangePasswordModal}
                    />
                </div>
                <div>
                    <GenerateReportModal
                        modalIsOpen={reportModal}
                        toggleModal={toggleReportModal} />
                </div>
            </div>
            <div>
                <ToastContainer />
            </div>
        </header>
    );
};

export default HeaderComponent;
