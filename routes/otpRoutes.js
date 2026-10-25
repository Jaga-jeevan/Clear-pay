const express = require("express");

const router = express.Router();

const otpController = require("../controllers/otpController");


const {
    otpLimiter
} = require("../middleware/rateLimiter");




// ==========================
// Swagger Tags
// ==========================

/**
 * @swagger
 * tags:
 *   name: OTP
 *   description: OTP verification and management APIs
 */






// ==========================
// OTP Routes
// ==========================



/**
 * @swagger
 * /api/otp/send:
 *   post:
 *     summary: Send OTP
 *     tags: [OTP]
 */

router.post(

    "/send",

    otpLimiter,

    otpController.sendOTP

);







/**
 * @swagger
 * /api/otp/verify:
 *   post:
 *     summary: Verify OTP
 *     tags: [OTP]
 */

router.post(

    "/verify",

    otpLimiter,

    otpController.verifyOTP

);







/**
 * @swagger
 * /api/otp/resend:
 *   post:
 *     summary: Resend OTP
 *     tags: [OTP]
 */

router.post(

    "/resend",

    otpLimiter,

    otpController.resendOTP

);







/**
 * @swagger
 * /api/otp/status:
 *   get:
 *     summary: Check OTP status
 *     tags: [OTP]
 */

router.get(

    "/status",

    otpController.checkOTPStatus

);







/**
 * @swagger
 * /api/otp:
 *   delete:
 *     summary: Delete OTP record
 *     tags: [OTP]
 */

router.delete(

    "/",

    otpController.deleteOTP

);







module.exports = router;