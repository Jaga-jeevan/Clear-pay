const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/verify-passkey', adminController.verifyPasskey);
router.get('/transactions', adminController.getAllTransactions);
router.get('/fraud-logs', adminController.getFraudLogs);
router.post('/review-transaction', adminController.reviewTransaction);
router.get('/stats', adminController.getStats);

module.exports = router;