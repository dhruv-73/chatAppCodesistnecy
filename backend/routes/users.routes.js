const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { body } = require("express-validator")
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', [
    body('name').isLength({ min: 1 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userController.register);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required')
], userController.login);

router.post('/logout', userController.logout);

router.post('/update-profile',authMiddleware.authUser, userController.updateProfilePic);

router.get('/check',authMiddleware.authUser, userController.check);

module.exports = router;