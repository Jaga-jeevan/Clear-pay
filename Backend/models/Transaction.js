const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['DEBIT', 'CREDIT'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  beneficiaryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beneficiary'
  },
  beneficiaryName: String,
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'BLOCKED', 'VERIFICATION_REQUIRED'],
    default: 'PENDING'
  },
  fraudScore: {
    type: Number,
    min: 0,
    max: 100
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH']
  },
  fraudReasons: [String],
  deviceId: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);