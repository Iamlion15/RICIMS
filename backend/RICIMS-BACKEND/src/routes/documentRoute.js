const router = require("express").Router();
const checkAuthentication = require("../middlewares/checkAuthentication")
const uploadDocument = require("../middlewares/uploadDocument")
const {documentStatistics,CountDocumentsByRABApproval,CountDocumentsByRSBApproval,CountDocumentsByRICAApproval,getDocumentInRange,getPendingDocumentInRange,getItemTypes,generateApprovedReport,CountDocumentsSentAndApprovedByMonth,
    CountRICADocumentsSentAndApprovedByMonth,CountRSBDocumentsSentAndApprovedByMonth,documentApprovedStatistics
}=require("../controller/statisticsController")
const { checkPRODUCERAuthorization,checkApproversAuthorization, checkRAButhorization, checkRSButhorization, checkRICAAuthorization } = require("../middlewares/checkAuthorization")
const {acceptPayment,processFailureInfo,processSuccessInfo,getInvoices}=require("../controller/payController")


const { addDocument, deleteDocument, getDocuments, getOneDocument, updateDocument,ReviewApplication,getApproversDocuments } = require("../controller/documentController")


router.post("/save", checkAuthentication, checkPRODUCERAuthorization,uploadDocument, addDocument)
router.post("/approve", checkAuthentication, checkApproversAuthorization, ReviewApplication)
router.post("/update", checkAuthentication, checkPRODUCERAuthorization,uploadDocument, updateDocument)
router.delete("/delete/:id", checkAuthentication, checkPRODUCERAuthorization, deleteDocument)
router.get("/getall", checkAuthentication, getDocuments)
router.get("/getdocuments", checkAuthentication, getApproversDocuments)
router.get("/get/:id", checkAuthentication, getOneDocument);
router.get("/statistics",checkAuthentication,checkPRODUCERAuthorization,documentStatistics)
router.get("/statistics/percentage",checkAuthentication,checkPRODUCERAuthorization,documentApprovedStatistics)
router.get("/rabstatistics",checkAuthentication,checkRAButhorization,CountDocumentsByRABApproval)
router.get("/rabstatistics/eachmonth",checkAuthentication,checkRAButhorization,CountDocumentsSentAndApprovedByMonth)
router.get("/rsbstatistics/eachmonth",checkAuthentication,checkRSButhorization,CountRSBDocumentsSentAndApprovedByMonth)
router.get("/ricastatistics/eachmonth",checkAuthentication,checkRICAAuthorization,CountRICADocumentsSentAndApprovedByMonth)
router.get("/rsbstatistics",checkAuthentication,checkRSButhorization,CountDocumentsByRSBApproval)
router.get("/ricastatistics",checkAuthentication,checkRICAAuthorization,CountDocumentsByRICAApproval)
router.post("/countdocumentsinrange",checkAuthentication,checkApproversAuthorization,getDocumentInRange)
router.post("/countpendingdocumentsinrange",checkAuthentication,checkApproversAuthorization,getPendingDocumentInRange,getItemTypes)
router.get("/getitemtypes",checkAuthentication,checkApproversAuthorization,getItemTypes)
router.post("/generate-report",checkAuthentication,checkApproversAuthorization,generateApprovedReport)
router.post("/pay",checkAuthentication,checkPRODUCERAuthorization,acceptPayment)
router.get("/processfailure",processFailureInfo)
router.get("/processsuccess/:id/:amount", processSuccessInfo);
router.get("/paymenthistory",checkAuthentication,checkPRODUCERAuthorization,getInvoices)



module.exports = router