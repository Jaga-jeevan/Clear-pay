const Transaction = require('../models/Transaction');
const Beneficiary = require('../models/Beneficiary');

// Main fraud scoring function
const calculateFraudScore = async (userId, transactionData) => {
  let fraudScore = 0;
  const fraudReasons = [];
  const mlFeatures = {};

  // Rule 1: New Beneficiary Check (30 points)
  const isNewBeneficiary = await checkNewBeneficiary(userId, transactionData.beneficiaryId);
  if (isNewBeneficiary) {
    fraudScore += 30;
    fraudReasons.push('New beneficiary detected');
    mlFeatures.newBeneficiaryFlag = 1;
    } else {
    mlFeatures.newBeneficiaryFlag = 0;
  }

  // Rule 2: High Amount Check (25 points)
  const { isHighAmount, avgAmount } = await checkHighAmount(userId, transactionData.amount);
  if (isHighAmount) {
    fraudScore += 25;
    fraudReasons.push(`Amount ${(transactionData.amount / avgAmount).toFixed(1)}x higher than average`);
  }
  mlFeatures.amountRatio = transactionData.amount / (avgAmount || 1000);

  // Rule 3: Transaction Velocity (20 points)
  const velocityScore = await checkTransactionVelocity(userId);
  if (velocityScore > 3) {
    fraudScore += 20;
    fraudReasons.push('High transaction velocity detected');
  }
  mlFeatures.velocityScore = velocityScore;

  // Rule 4: Unusual Time (15 points)
  const isUnusualTime = checkUnusualTime();
  if (isUnusualTime) {
    fraudScore += 15;
    fraudReasons.push('Transaction at unusual hours');
  }
  mlFeatures.timeAnomaly = isUnusualTime ? 1 : 0;

  // Rule 5: New Device (10 points)
  const isNewDevice = checkNewDevice(transactionData.deviceId);
  if (isNewDevice) {
    fraudScore += 10;
    fraudReasons.push('New device detected');
    mlFeatures.deviceTrustScore = 0.3;
  } else {
    mlFeatures.deviceTrustScore = 0.9;
  }

  // ML-Style Weighted Scoring (XGBoost simulation)
  // Combine features with learned weights
  const mlScore = (
    mlFeatures.newBeneficiaryFlag * 0.35 +
    (mlFeatures.amountRatio > 2 ? 0.25 : 0) +
    (mlFeatures.velocityScore > 3 ? 0.20 : 0) +
    mlFeatures.timeAnomaly * 0.15 +
    (1 - mlFeatures.deviceTrustScore) * 0.05
  ) * 100;

  // Combine rule-based and ML score (weighted average)
  fraudScore = Math.round((fraudScore * 0.6) + (mlScore * 0.4));
  fraudScore = Math.min(fraudScore, 100); // Cap at 100

  // Determine risk level
  let riskLevel;
  if (fraudScore >= 70) {
    riskLevel = 'HIGH';
  } else if (fraudScore >= 40) {
    riskLevel = 'MEDIUM';
  } else {
    riskLevel = 'LOW';
  }

  return {
    fraudScore,
    riskLevel,
    fraudReasons,
    mlFeatures
  };
};

// Helper: Check if beneficiary is new
const checkNewBeneficiary = async (userId, beneficiaryId) => {
  if (!beneficiaryId) return true;
  
  const beneficiary = await Beneficiary.findById(beneficiaryId);
  if (!beneficiary) return true;

  const daysSinceAdded = (Date.now() - beneficiary.addedAt) / (1000 * 60 * 60 * 24);
  return daysSinceAdded < 7; // New if added within 7 days
};

// Helper: Check if amount is unusually high
const checkHighAmount = async (userId, amount) => {
  const recentTransactions = await Transaction.find({
    userId,
    status: 'COMPLETED',
    type: 'DEBIT'
  }).sort({ timestamp: -1 }).limit(10);

  if (recentTransactions.length === 0) {
    return { isHighAmount: amount > 10000, avgAmount: 1000 };
  }

  const avgAmount = recentTransactions.reduce((sum, t) => sum + t.amount, 0) / recentTransactions.length;
  const isHighAmount = amount > avgAmount * 2;

  return { isHighAmount, avgAmount };
};

// Helper: Check transaction velocity (count in last 1 hour)
const checkTransactionVelocity = async (userId) => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  const count = await Transaction.countDocuments({
    userId,
    timestamp: { $gte: oneHourAgo }
  });

  return count;
};

// Helper: Check if transaction is at unusual time (10 PM - 6 AM)
const checkUnusualTime = () => {
  const hour = new Date().getHours();
  return hour >= 22 || hour < 6;
};

// Helper: Check if device is new (simplified)
const checkNewDevice = (deviceId) => {
  // In production, check against user's registered devices
  // For demo, randomly flag some devices as new
  return Math.random() < 0.3; // 30% chance of new device
};

module.exports = { calculateFraudScore };