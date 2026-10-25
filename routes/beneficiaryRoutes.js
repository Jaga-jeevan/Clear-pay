const express = require("express");

const router = express.Router();


const beneficiaryController =
require("../controllers/beneficiaryController");


const auth =
require("../middleware/auth");


const {
    apiLimiter
} = require("../middleware/rateLimiter");




// ==========================
// Swagger Tags
// ==========================

/**
 * @swagger
 * tags:
 *   name: Beneficiaries
 *   description: Beneficiary management APIs
 */






// ==========================
// Authentication
// ==========================

router.use(auth);




// ==========================
// Beneficiary Routes
// ==========================



// Add Beneficiary

router.post(

    "/",

    apiLimiter,

    beneficiaryController.addBeneficiary

);







// Get Beneficiaries

router.get(

    "/",

    beneficiaryController.getBeneficiaries

);







// Delete Beneficiary

router.delete(

    "/:id",

    apiLimiter,

    beneficiaryController.deleteBeneficiary

);






module.exports = router;