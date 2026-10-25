const mongoose = require('mongoose');

const FraudLogSchema = new mongoose.Schema({
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fraudScore: {
    type: Number,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    required: true
  },
  fraudReasons: [String],
  mlFeatures: {
    amountRatio: Number,
    timeAnomaly: Number,
    velocityScore: Number,
    newBeneficiaryFlag: Number,
    deviceTrustScore: Number
  },
  action: {
    type: String,
    enum: ['ALLOWED', 'BLOCKED', 'VERIFICATION_REQUIRED']
  },
  adminAction: {
    type: String,
    enum: ['APPROVED', 'REJECTED', 'PENDING'],
    default: 'PENDING'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FraudLog', FraudLogSchema);