const Transaction = require('../models/Transaction');
const FraudLog = require('../models/FraudLog');
const User = require('../models/User');

// Verify admin passkey
exports.verifyPasskey = async (req, res) => {
  try {
    const { passkey } = req.body;

    if (passkey === process.env.ADMIN_PASSKEY) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Invalid passkey' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('userId', 'fullName email')
      .populate('beneficiaryId')
      .sort({ timestamp: -1 })
      .limit(100);

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get fraud logs
exports.getFraudLogs = async (req, res) => {
  try {
    const fraudLogs = await FraudLog.find()
      .populate('userId', 'fullName email')
      .populate('transactionId')
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(fraudLogs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Approve/Reject high-risk transaction
exports.reviewTransaction = async (req, res) => {
  try {
    const { transactionId, action } = req.body; // action: 'APPROVED' or 'REJECTED'

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const fraudLog = await FraudLog.findOne({ transactionId });
    
    if (action === 'APPROVED') {
      transaction.status = 'COMPLETED';
      
      // Deduct balance
      const user = await User.findById(transaction.userId);
      user.balance -= transaction.amount;
      await user.save();
    } else {
      transaction.status = 'BLOCKED';
    }

    if (fraudLog) {
      fraudLog.adminAction = action;
      await fraudLog.save();
    }

    await transaction.save();

    res.json({ message: `Transaction ${action.toLowerCase()}`, transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get dashboard stats
exports.getStats = async (req, res) => {
  try {
    const totalTransactions = await Transaction.countDocuments();
    const blockedTransactions = await Transaction.countDocuments({ status: 'BLOCKED' });
    const verificationRequired = await Transaction.countDocuments({ status: 'VERIFICATION_REQUIRED' });
    const highRiskCount = await Transaction.countDocuments({ riskLevel: 'HIGH' });

    const avgFraudScore = await Transaction.aggregate([
      { $group: { _id: null, avg: { $avg: '$fraudScore' } } }
    ]);

    res.json({
      totalTransactions,
      blockedTransactions,
      verificationRequired,
      highRiskCount,
      avgFraudScore: avgFraudScore[0]?.avg || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};