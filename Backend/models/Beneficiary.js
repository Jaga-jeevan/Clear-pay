const mongoose = require('mongoose');

const BeneficiarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true
  },
  bankName: String,
  ifscCode: String,
  addedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Beneficiary', BeneficiarySchema);