import { useState, useEffect } from "react"


const ReportPanel = () => {
    const [role, setRole] = useState('')
    useEffect(() => {
        const rol = JSON.parse(localStorage.getItem('loggedInUser')).role;
        setRole(rol)
    }, [])

    return (
        <>
            <div className="row my-2">
                <div className="col">
                    <button className="btn btn-outline-primary">
                        <div className="d-flex flex-row">
                            <span className="mx-2">Vendor Reports</span>
                            <i class="bi bi-backpack4"></i>
                        </div>
                    </button>
                </div>
                <div className="col">
                    <button className="btn btn-outline-primary">
                        <div className="d-flex flex-row">
                            <span className="mx-2">Periodic requested Item report</span>
                            <i class="bi bi-clipboard-data-fill" ></i>
                        </div>
                    </button>
                </div>
                <div className="col">
                    <button className="btn btn-outline-primary">
                        <div className="d-flex flex-row">
                            <span className="mx-2">{role} Usual reports</span>
                            <i class="bi bi-graph-up"></i>
                        </div>
                    </button>
                </div>
            </div>
        </>
    )
}


export default ReportPanel