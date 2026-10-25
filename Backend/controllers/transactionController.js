const Transaction = require('../models/Transaction');
const Beneficiary = require('../models/Beneficiary');
const FraudLog = require('../models/FraudLog');
const User = require('../models/User');
const { calculateFraudScore } = require('../services/fraudScoringService');

// Check fraud before transfer
exports.checkFraud = async (req, res) => {
  try {
    const { beneficiaryId, amount, deviceId } = req.body;

    const transactionData = {
      beneficiaryId,
      amount,
      deviceId
    };

    // Calculate fraud score
    const fraudResult = await calculateFraudScore(req.userId, transactionData);

    res.json(fraudResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fraud check failed' });
  }
};

// Execute transfer
exports.transfer = async (req, res) => {
  try {
    const { beneficiaryId, amount, deviceId } = req.body;

    // Get user
    const user = await User.findById(req.userId);
    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Get beneficiary
    const beneficiary = await Beneficiary.findById(beneficiaryId);
    if (!beneficiary) {
      return res.status(404).json({ error: 'Beneficiary not found' });
    }

    // Calculate fraud score
    const fraudResult = await calculateFraudScore(req.userId, {
      beneficiaryId,
      amount,
      deviceId
    });

    // Determine transaction status based on risk level
    let status;
    let action;
    
    if (fraudResult.riskLevel === 'HIGH') {
      status = 'BLOCKED';
      action = 'BLOCKED';
    } else if (fraudResult.riskLevel === 'MEDIUM') {
      status = 'VERIFICATION_REQUIRED';
      action = 'VERIFICATION_REQUIRED';
    } else {
      status = 'COMPLETED';
      action = 'ALLOWED';
      
      // Deduct balance only if LOW risk
      user.balance -= amount;
      await user.save();
    }

    // Create transaction
    const transaction = new Transaction({
      userId: req.userId,
      type: 'DEBIT',
      amount,
      beneficiaryId,
      beneficiaryName: beneficiary.name,
      status,
      fraudScore: fraudResult.fraudScore,
      riskLevel: fraudResult.riskLevel,
      fraudReasons: fraudResult.fraudReasons,
      deviceId
    });

    await transaction.save();

    // Create fraud log
    const fraudLog = new FraudLog({
      transactionId: transaction._id,
      userId: req.userId,
      fraudScore: fraudResult.fraudScore,
      riskLevel: fraudResult.riskLevel,
      fraudReasons: fraudResult.fraudReasons,
      mlFeatures: fraudResult.mlFeatures,
      action
    });

    await fraudLog.save();

    res.json({
      transaction,
      fraudResult,
      newBalance: user.balance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Transfer failed' });
  }
};

// Get transaction history
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId })
      .populate('beneficiaryId')
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get fraud alerts (blocked/verification required)
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Transaction.find({
      userId: req.userId,
      status: { $in: ['BLOCKED', 'VERIFICATION_REQUIRED'] }
    }).sort({ timestamp: -1 });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};