const Transaction = require("../models/Transaction");
const FraudLog = require("../models/FraudLog");
const User = require("../models/User");

// ==========================
// Dashboard Analytics
// ==========================
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalTransactions,
      totalFraudLogs,
      completedTransactions,
      blockedTransactions,
      verificationRequired,
    ] = await Promise.all([
      User.countDocuments(),
      Transaction.countDocuments(),
      FraudLog.countDocuments(),
      Transaction.countDocuments({ status: "COMPLETED" }),
      Transaction.countDocuments({ status: "BLOCKED" }),
      Transaction.countDocuments({ status: "VERIFICATION_REQUIRED" }),
    ]);

    const avgFraudScore = await FraudLog.aggregate([
      {
        $group: {
          _id: null,
          averageScore: {
            $avg: "$fraudScore",
          },
        },
      },
    ]);

    const totalTransferred = await Transaction.aggregate([
      {
        $match: {
          status: "COMPLETED",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: "$amount",
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalTransactions,
        totalFraudLogs,
        completedTransactions,
        blockedTransactions,
        verificationRequired,
        totalTransferred:
          totalTransferred.length > 0
            ? totalTransferred[0].totalAmount
            : 0,
        averageFraudScore:
          avgFraudScore.length > 0
            ? Number(avgFraudScore[0].averageScore.toFixed(2))
            : 0,
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================
// Monthly Transaction Report
// ==========================
exports.getMonthlyReport = async (req, res) => {
  try {
    const report = await Transaction.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalTransactions: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Monthly Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================
// Risk Distribution
// ==========================
exports.getRiskDistribution = async (req, res) => {
  try {
    const risks = await FraudLog.aggregate([
      {
        $group: {
          _id: "$riskLevel",
          count: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      risks,
    });
  } catch (error) {
    console.error("Risk Distribution Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================
// Top Fraud Reasons
// ==========================
exports.getTopFraudReasons = async (req, res) => {
  try {
    const reasons = await FraudLog.aggregate([
      {
        $unwind: "$fraudReasons",
      },
      {
        $group: {
          _id: "$fraudReasons",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    return res.status(200).json({
      success: true,
      reasons,
    });
  } catch (error) {
    console.error("Fraud Reasons Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};