const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

router.post('/check-fraud', auth, transactionController.checkFraud);
router.post('/transfer', auth, transactionController.transfer);
router.get('/', auth, transactionController.getTransactions);
router.get('/alerts', auth, transactionController.getAlerts);

module.exports = router;