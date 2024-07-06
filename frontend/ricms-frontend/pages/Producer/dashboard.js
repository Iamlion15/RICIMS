import { useState, useEffect } from "react";
import DashboardCard from "@/components/dashboardComponent/dashboardCard";
import axios from "axios";
import PercentageProducerDoghnutCompletion from "@/components/statistics component/percentageProducerCompletion";
import PercentageApprovedDocuments from "@/components/statistics component/percentageApprovedCompletion";


const Dashboard = () => {
    const [data, setData] = useState({
        rica: "",
        rsb: "",
        rab: "",
        total: ""
    })
    const [percentage, setPercentage] = useState({
        rica: 0,
        rsb: 0,
        rab: 0,
        dataPresent: false
    })
    const [percentageStats, setPercentageStats] = useState({
        percentage,
        dataPresent: false
    })
    useEffect(() => {
        const fetchData = async () => {
            const config = {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': JSON.parse(localStorage.getItem("token"))
                }
            }
            try {
                const response = await axios.get("http://localhost:5000/api/document/statistics", config);
                const responseStats = await axios.get("http://localhost:5000/api/document/statistics/percentage", config);
                console.log(responseStats.data);
                setData({
                    rica: response.data.rica,
                    rsb: response.data.rsb,
                    rab: response.data.rab,
                    total: response.data.total
                });

                const ricaPercentage = response.data.total > 0 ? (response.data.rica / response.data.total) * 100 : 0;
                const rsbPercentage = response.data.total > 0 ? (response.data.rsb / response.data.total) * 100 : 0;
                const rabPercentage = response.data.total > 0 ? (response.data.rab / response.data.total) * 100 : 0;
                const approved = response.data.total > 0 ? (responseStats.data.approved / response.data.total) * 100 : 0;
                // Determine if data is present
                const dataPresent = response.data.total > 0;
                // Update state
                setPercentage({
                    rica: ricaPercentage.toFixed(0),
                    rsb: rsbPercentage.toFixed(0),
                    rab: rabPercentage.toFixed(0),
                    dataPresent: dataPresent
                });
                setPercentageStats({
                    percentage: approved.toFixed(0),
                    dataPresent: dataPresent
                })
            } catch (error) {
                console.log(error);
                // Handle error state
                setPercentage({
                    rica: 0,
                    rsb: 0,
                    rab: 0,
                    dataPresent: false
                });
                setPercentageStats({
                    percentage: 0,
                    dataPresent: false
                })
            }
        };

        // Call fetchData immediately
        fetchData();
    }, []);

    return (
        <>
            <div className="row mt-0 font-monospace">
                <DashboardCard color="bg-danger" message="RICA Approved application(s)" icon="bi-journal-check" number={data.rica} />
                <DashboardCard color="bg-warning" message="RSB Approved application(s)" icon="bi-stopwatch" number={data.rsb} />
                <DashboardCard color="bg-success" message="RAB Approved application(s)" icon="bi-file-earmark-check-fill" number={data.rab} />
                <DashboardCard color="bg-primary" message="Total number of application(s)" icon="bi-binoculars-fill" number={data.total} />
            </div>
            <div className="row mt-2">
                <div className="col-6">
                    <div className="d-flex justify-content-start mt-2">
                        <h5 className="text-primary"><strong>Approvals</strong></h5>
                    </div>
                    <PercentageProducerDoghnutCompletion data={percentage} />
                </div>
                <div className="col-6">
                    <div className="d-flex justify-content-center mt-2">
                        <h5 className="text-primary"><strong>percentage of document approvals</strong></h5>
                    </div>
                    <PercentageApprovedDocuments percentage={percentageStats} />
                </div>
            </div>

        </>
    )
}



export default Dashboard;