const jwt=require('jsonwebtoken');
const userModel=require('../models/user.model');

module.exports.authUser=async(req,res,next)=>{
    const token =req.cookies.token || req.header?.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }

    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await userModel.findById(decoded._id).select("-password");
        if(!user){
            return res.status(401).json({message:"Unauthorized"});
        }
        req.user=user;
        next();
    } catch (error) {
        return res.status(401).json({message:"Internal server error during authentication"});
    }

}