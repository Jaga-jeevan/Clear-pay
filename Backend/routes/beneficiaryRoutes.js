const express = require('express');
const router = express.Router();
const beneficiaryController = require('../controllers/beneficiaryController');
const auth = require('../middleware/auth');

router.post('/', auth, beneficiaryController.addBeneficiary);
router.get('/', auth, beneficiaryController.getBeneficiaries);
router.delete('/:id', auth, beneficiaryController.deleteBeneficiary);

module.exports = router;