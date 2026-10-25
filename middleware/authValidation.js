const { body } = require("express-validator");


// ==========================
// Register Validation
// ==========================
const registerValidation = [

  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({
      min: 3,
      max: 50,
    })
    .withMessage(
      "Full name must be between 3 and 50 characters"
    )
    .escape(),


  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail()
    .isLength({
      max: 100,
    })
    .withMessage("Email is too long"),



  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage(
      "Enter a valid 10-digit Indian mobile number"
    ),



  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({
      min: 8,
      max: 128,
    })
    .withMessage(
      "Password must be between 8 and 128 characters"
    )
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must contain uppercase, lowercase, number and special character"
    ),

];



// ==========================
// Login Validation
// ==========================
const loginValidation = [

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email")
    .normalizeEmail(),


  body("password")
    .notEmpty()
    .withMessage("Password is required"),

];


module.exports = {
  registerValidation,
  loginValidation,
};