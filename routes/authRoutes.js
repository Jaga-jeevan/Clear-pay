const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const auth = require("../middleware/auth");


const {
    registerValidation,
    loginValidation,
} = require("../middleware/authValidation");


const validate = require("../middleware/validation");


const {
    loginLimiter,
    registerLimiter,
    otpLimiter
} = require("../middleware/rateLimiter");







// ==========================
// Swagger Tags
// ==========================

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: NexusBank authentication APIs
 */







// ==========================
// Register
// ==========================

router.post(

    "/register",

    registerLimiter,

    registerValidation,

    validate,

    authController.register

);







// ==========================
// Login
// ==========================

router.post(

    "/login",

    loginLimiter,

    loginValidation,

    validate,

    authController.login

);








// ==========================
// Forgot Password
// ==========================


router.post(

    "/forgot-password",

    otpLimiter,

    authController.forgotPassword

);








// ==========================
// Reset Password
// ==========================


router.post(

    "/reset-password",

    otpLimiter,

    authController.resetPassword

);








// ==========================
// Current User
// ==========================


router.get(

    "/me",

    auth,

    authController.getMe

);








// ==========================
// Refresh Token
// ==========================


router.post(

    "/refresh-token",

    authController.refreshToken

);








// ==========================
// Logout
// ==========================


router.post(

    "/logout",

    authController.logout

);








// ==========================
// Logout All Devices
// ==========================


router.post(

    "/logout-all",

    auth,

    authController.logoutAll

);






module.exports = router;