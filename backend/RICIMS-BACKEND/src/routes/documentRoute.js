const router = require("express").Router();
const checkAuthentication = require("../middlewares/checkAuthentication")
const uploadDocument = require("../middlewares/uploadDocument")
const {documentStatistics}=require("../controller/statisticsController")
const { checkPRODUCERAuthorization } = require("../middlewares/checkAuthorization")


const { addDocument, deleteDocument, getDocuments, getOneDocument, updateDocument } = require("../controller/documentController")


router.post("/save", checkAuthentication, checkPRODUCERAuthorization,uploadDocument, addDocument)
router.post("/update", checkAuthentication, checkPRODUCERAuthorization,uploadDocument, updateDocument)
router.delete("/delete/:id", checkAuthentication, checkPRODUCERAuthorization, deleteDocument)
router.get("/getall", checkAuthentication, checkPRODUCERAuthorization, getDocuments)
router.get("/get/:id", checkAuthentication, checkPRODUCERAuthorization, getOneDocument);
router.get("/statistics",checkAuthentication,checkPRODUCERAuthorization,documentStatistics)

module.exports = router