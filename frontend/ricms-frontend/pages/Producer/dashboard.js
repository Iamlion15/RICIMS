import { useState, useEffect } from "react";
import DashboardCard from "@/components/dashboardComponent/dashboardCard";
import axios from "axios";


const Dashboard = () => {
    const [data, setData] = useState({
        pending: "",
        canceled: "",
        underReview: "",
        approved: ""
    })
    useEffect(async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': JSON.parse(localStorage.getItem("token"))
            }
        }
        try {
            const response = await axios.get("http://localhost:5000/api/document/statistics", config);
            console.log(response.data);
            setData({
                pending: response.data.pending,
                approved: response.data.approved,
                underReview: response.data.underReview,
                canceled: response.data.canceled
            })
        } catch (error) {
            console.log(error)
        }
    }, [])
    return (
        <>
            <div className="row mt-5">
                <DashboardCard color="bg-danger" message="canceled application(s)" icon="bi-journal-check" number={data.canceled} />
                <DashboardCard color="bg-warning" message="pending application(s)" icon="bi-stopwatch" number={data.pending} />
                <DashboardCard color="bg-success" message="approved application(s)" icon="bi-file-earmark-check-fill" number={data.approved} />
            </div>
            <div className="row mt-5">
                <DashboardCard color="bg-primary" message="Under-review application(s)" icon="bi-binoculars-fill" number={data.underReview} />
            </div>
        </>
    )
}



export default Dashboard;