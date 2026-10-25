const express = require("express");

const router = express.Router();


const transactionController =
require("../controllers/transactionController");


const auth =
require("../middleware/auth");


const {
    fraudLimiter
} = require("../middleware/rateLimiter");





// ==========================
// Authentication
// ==========================

router.use(auth);







// ==========================
// Fraud Analysis
// ==========================


router.post(

    "/check-fraud",

    fraudLimiter,

    transactionController.checkFraud

);








// ==========================
// Money Transfer
// ==========================


router.post(

    "/transfer",

    transactionController.transfer

);








// ==========================
// Transaction History
// ==========================


router.get(

    "/",

    transactionController.getTransactions

);








// ==========================
// Fraud Alerts
// ==========================


router.get(

    "/alerts",

    transactionController.getAlerts

);






module.exports = router;