import { useState } from "react"
import ReportPanel from "./reportPanel"
import VendorReport from "./vendorReport"



const Report=()=>{
    const [activePanel,setActivePanel]=useState("Vendor Report")
    return(
        <>
        <div className="card rounded-4">
            <div className="card-header">
                <p className="my-2">Detailed vendor Report</p>
            </div>
            <div className="my-2 mx-2">
                    {activePanel ==="Vendor Report"&& <VendorReport/>}
                    {activePanel ==="Vendor "&& <VendorReport/>}
            </div>
        </div>
        </>
    )
}


export default Report;