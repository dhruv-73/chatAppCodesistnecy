const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");
const cloudinary = require("../lib/cloudinary");
const { io,receiverSocketId } = require("../lib/socket");


module.exports.getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const filteredUser = await userModel.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUser);
    } catch (error) {
        console.log("Error in getUserForSidebar controller", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports.getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await messageModel.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports.sendMessage = async (req, res) => {
    try {
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;

        if(!text && !image){
            return res.status(400).json({message:"Message text or image is required"});
        }
        let imageUrl;
        if(image){
            const response=await cloudinary.uploader.upload(image)
            imageUrl=response.secure_url;
        }

        const newMessage=await messageModel.create({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })

        //emit socket event to receiver if online
        const receiverSocket=receiverSocketId(receiverId);
        if(receiverSocket){
            io.to(receiverSocket).emit("newMessage",newMessage)
        }

        

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
