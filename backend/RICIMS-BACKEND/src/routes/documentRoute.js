const router = require("express").Router();
const checkAuthentication = require("../middlewares/checkAuthentication")
const uploadDocument = require("../middlewares/uploadDocument")
const {documentStatistics,CountDocumentsByRABApproval,CountDocumentsByRSBApproval,CountDocumentsByRICAApproval,getDocumentInRange,getPendingDocumentInRange}=require("../controller/statisticsController")
const { checkPRODUCERAuthorization,checkApproversAuthorization, checkRAButhorization, checkRSButhorization, checkRICAAuthorization } = require("../middlewares/checkAuthorization")


const { addDocument, deleteDocument, getDocuments, getOneDocument, updateDocument,ReviewApplication } = require("../controller/documentController")


router.post("/save", checkAuthentication, checkPRODUCERAuthorization,uploadDocument, addDocument)
router.post("/approve", checkAuthentication, checkApproversAuthorization, ReviewApplication)
router.post("/update", checkAuthentication, checkPRODUCERAuthorization,uploadDocument, updateDocument)
router.delete("/delete/:id", checkAuthentication, checkPRODUCERAuthorization, deleteDocument)
router.get("/getall", checkAuthentication, getDocuments)
router.get("/get/:id", checkAuthentication, getOneDocument);
router.get("/statistics",checkAuthentication,checkPRODUCERAuthorization,documentStatistics)
router.get("/rabstatistics",checkAuthentication,checkRAButhorization,CountDocumentsByRABApproval)
router.get("/rsbstatistics",checkAuthentication,checkRSButhorization,CountDocumentsByRSBApproval)
router.get("/ricastatistics",checkAuthentication,checkRICAAuthorization,CountDocumentsByRICAApproval)
router.post("/countdocumentsinrange",checkAuthentication,checkApproversAuthorization,getDocumentInRange)
router.post("/countpendingdocumentsinrange",checkAuthentication,checkApproversAuthorization,getPendingDocumentInRange)


module.exports = router