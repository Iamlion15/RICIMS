import { useState, useEffect } from "react";
import DashboardCard from "@/components/dashboardComponent/ApproversDashboardCard";
import axios from "axios";
import PercentageDoghnutCompletion from "@/components/statistics component/percentageDoghnutCompletion";
import BarchartAnalytics from "@/components/statistics component/barchartComputation";


const Dashboard = () => {
    const [data, setData] = useState({
        pending: "",
        approved: ""
    })
    const [monthPerformance, setMonthPerformance] = useState([])
    const [percentage, setPercentage] = useState({
        percentage: 0,
        dataPresent: false
    })
    useEffect(async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': JSON.parse(localStorage.getItem("token"))
            }
        }
        try {
            const response = await axios.get("http://localhost:5000/api/document/rsbstatistics", config);
            const responseMonthly = await axios.get("http://localhost:5000/api/document/rsbstatistics/eachmonth", config);
            console.log(responseMonthly.data);
            setMonthPerformance(responseMonthly.data)
            const { approved, pending } = response.data;
            const total = approved + pending;

            const calculatedPercentage = total > 0 ? (approved / total) * 100 : 0;

            setPercentage({
                percentage: calculatedPercentage.toFixed(0),
                dataPresent: true
            });
            setData({
                pending: response.data.pending,
                approved: response.data.approved,
            })
        } catch (error) {
            console.log(error)
            setPercentage({
                percentage: 0,
                dataPresent: false
            });
        }
    }, [])
    return (
        <>
            <div className="row mt-3 font-monospace">
                <DashboardCard color="bg-warning" message="pending application(s)" icon="bi-stopwatch" number={data.pending} />
                <DashboardCard color="bg-success" message="approved application(s)" icon="bi-file-earmark-check-fill" number={data.approved} />
            </div>
            <div className="row mt-2">
                <div className="col-4">
                    <div className="mt-4">
                    <PercentageDoghnutCompletion percentage={percentage} />
                    </div>
                </div>
                <div className="col-8">
                    <BarchartAnalytics data={monthPerformance} />
                </div>
            </div>
        </>
    )
}



export default Dashboard;