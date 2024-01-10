import { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from "@/components/sideNav/sidebar"
import HeaderComponent from "../../components/Header/Header"
import AddProduct from "./addProduct"
import MyApplications from "./myApplications";
import Dashboard from "./dashboard";
import Logout from "@/helpers/logout";
import MyComments from "@/components/commentComponent.js/myComments";
import { useRouter } from 'next/router';
import ApprovedApplications from "./ApprovedApplications";
import SuccessfullPayment from "../../components/Modals/successPaymentModal";
import FailurePayment from "@/components/Modals/failurePyamentModel";
import PaymentHistory from "./paymentHistory";

const Index = () => {
    const [page, setPage] = useState("Dashboard")
    const [msg,setMsg]=useState('')
    const router = useRouter();
    const [statusModal, setStatusModal] = useState(false);
    const [failureStatusModal, setFailureStatusModal] = useState(false);
    const toggleStatusModal = () => {
        setStatusModal(!statusModal)
    }
    const toggleFailureStatusModal = () => {
        setFailureStatusModal(!failureStatusModal)
    }
    useEffect(() => {
        console.log(page);
    }, [page])
    useEffect(() => {
        const { status } = router.query;
        if (status === 'success') {
            toggleStatusModal()
            setMsg("successfully ")
            console.log('Success message!');
        }
        else {
            if (status === "failure") {
                toggleFailureStatusModal()
                console.log('failure message!');
            }
        }
    }, [router.query]);
    return (
        <>
            <div className="row">
                <Sidebar page={page} setPage={setPage} logout={Logout}/>
                <div className="col-9">
                    <HeaderComponent page={page} logout={Logout}/>
                    <div className="mt-4 p-4">
                        {page === "Dashboard" && (
                            <Dashboard />
                        )}
                        {page === "New Application" && (
                            <AddProduct />
                        )}
                        {page === 'My applications' && (
                            <MyApplications />
                        )}
                        {page === 'Comments' && (
                            <MyComments />
                        )}
                        {page === 'Pending payments' && (
                            <ApprovedApplications />
                        )}
                         {page === 'Payment history' && (
                            <PaymentHistory />
                        )}
                    </div>
                </div>
                <div>
                    {statusModal && <SuccessfullPayment toggleModal={toggleStatusModal} modalIsOpen={statusModal} />}
                    {failureStatusModal && <FailurePayment toggleModal={toggleFailureStatusModal} modalIsOpen={failureStatusModal} />}
                </div>
            </div>

        </>
    )
}


export default Index