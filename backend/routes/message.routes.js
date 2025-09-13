const express=require('express');
const router=express.Router();
const authMiddleware=require("../middlewares/auth.middleware");
const messageController=require("../controllers/message.controller");

router.get("/users",authMiddleware.authUser,messageController.getUserForSidebar)
router.get("/:id",authMiddleware.authUser,messageController.getMessages);

router.post("/send/:id",authMiddleware.authUser,messageController.sendMessage);


module.exports=router;