const express = require("express");

const router = express.Router();

const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");


// ==========================
// Authentication
// ==========================
router.use(auth);


// ==========================
// Admin Routes
// ==========================


// Verify Admin Passkey
router.post(
    "/verify-passkey",
    adminController.verifyPasskey
);


// Get All Transactions
router.get(
    "/transactions",
    adminController.getAllTransactions
);


// Get Fraud Logs
router.get(
    "/fraud-logs",
    adminController.getFraudLogs
);


// Review Transaction
router.patch(
    "/transactions/review",
    adminController.reviewTransaction
);


// Dashboard Stats
router.get(
    "/stats",
    adminController.getStats
);


module.exports = router;