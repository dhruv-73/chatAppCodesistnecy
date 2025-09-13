const userModel = require('../models/user.model')
const { validationResult } = require('express-validator')
const cloudinary = require('../lib/cloudinary')

module.exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await userModel.hashPassword(password);
        const newUser =await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        const token = newUser.generateToken();

        res.cookie("token", token);

        res.status(201).json({
            newUser,
            token
        });
    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = user.generateToken();

        res.cookie("token", token);

        res.status(200).json({
            user,
            token
        });
    } catch (error) {
        console.error("Error in user login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
}

module.exports.updateProfilePic = async (req, res) => {
    const { profileImage } = req.body;
    if (!profileImage) {
        return res.status(400).json({ message: "Profile image URL is required" });
    }

    try {
        const uploadResult = await cloudinary.uploader.upload(profileImage);
        const profileImageUrl = uploadResult.secure_url;
        const user = await userModel.findByIdAndUpdate(req.user._id, { profileImage: profileImageUrl }, { new: true }).select("-password");
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error in updating profile picture:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports.check = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in getting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}