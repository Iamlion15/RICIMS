import formatDateToCustomFormat from "@/helpers/dateFormatter"
import 'bootstrap/dist/css/bootstrap.min.css';
const ApprovedDocumentDetail = ({ data,goBack }) => {
    return (
        <>
            <div className="card">
                <div className="d-flex justify-content-end mt-3 mx-2 mb-2">
                    <button className="btn btn-primary btn-sm">
                        <div className="d-flex flex-row">
                            <span className="mx-2" onClick={goBack}>Go back</span>
                            <i class="bi bi-back"></i>
                        </div>
                    </button>
                </div>
                <table className="table table-borderless">
                    <thead>
                        <tr className="table-primary">
                            <td>Document detail</td>
                        </tr>
                    </thead>
                </table>
                <table className="table table-borderless">
                    <tbody>
                        <tr>
                            <td>Producer First name :</td>
                            <td>{data.owner.firstname}</td>
                        </tr>
                        <tr>
                            <td>Producer last name :</td>
                            <td>{data.owner.lastname}</td>
                        </tr>
                        <tr>
                            <td>Chemical type:</td>
                            <td>{data.document.psamples}</td>
                        </tr>
                        <tr>
                            <td>Total number of samples provided:</td>
                            <td>{data.document.tsamples}</td>
                        </tr>
                        <tr>
                            <td>Submitted one:</td>
                            <td>{formatDateToCustomFormat(data.createdAt)}</td>
                        </tr>
                        <tr>
                            <td>Submitted on:</td>
                            <td>{formatDateToCustomFormat(data.RAB_Approval.timeOfApproval)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ApprovedDocumentDetail