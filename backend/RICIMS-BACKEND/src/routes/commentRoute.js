const express=require("express")
const {sendComment,getComment,getCommentsBetweenUsers,markAsRead}=require("../controller/commentController")
const checkAuthentication=require("../middlewares/checkAuthentication")

const router=express.Router();

router.post("/send",checkAuthentication,sendComment)
router.post('/getcomment',checkAuthentication,getCommentsBetweenUsers)
router.get('/getcomments',checkAuthentication,getComment)
router.put("/markasread/:interactionid", checkAuthentication, markAsRead);




module.exports=router;

