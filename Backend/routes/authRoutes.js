const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

const {
  registerValidation,
  loginValidation,
} = require("../middleware/authValidation");

const validate = require("../middleware/validation");
const { loginLimiter } = require("../middleware/rateLimiter");

// Register
router.post(
  "/register",
  registerValidation,
  validate,
  authController.register
);

// Login
router.post(
  "/login",
  loginLimiter,
  loginValidation,
  validate,
  authController.login
);

// Current Logged-in User
router.get("/me", auth, authController.getMe);

module.exports = router;