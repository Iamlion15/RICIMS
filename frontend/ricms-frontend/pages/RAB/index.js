import { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from "@/components/sideNav/sidebar"
import HeaderComponent from "../../components/Header/Header"
import Dashboard from "./dashboard";
import Logout from "@/helpers/logout";
import MyApplications from "./myApplications";
import MyComments from "@/components/commentComponent.js/myComments";
import ApprovedDocuments from "./approvedDocumentDashboard";
import Report from "@/components/DetailedReports/report";
import DetailedReport from "./detailedReport";

const Index = () => {
    const [page, setPage] = useState("Dashboard")

    useEffect(() => {
        console.log(page);
    }, [page])
    return (
        <>
            <div className="row">
                <Sidebar page={page} setPage={setPage} logout={Logout} />
                <div className="col-9">
                    <HeaderComponent page={page} logout={Logout} />
                    <div className="mt-4 p-4">
                        {page === "Dashboard" && (
                            <Dashboard />
                        )}
                        {page === 'Review Applications' && (
                            <MyApplications />
                        )}
                        {page === 'Comments' && (
                            <MyComments />
                        )}
                        {page === 'Approved documents' && (
                            <ApprovedDocuments />
                        )}
                        {page === 'Detailed reports' && (
                            <DetailedReport />
                        )}
                    </div>
                </div>
            </div>

        </>
    )
}


export default Index