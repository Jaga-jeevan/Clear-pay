const Beneficiary = require("../models/Beneficiary");

// ==========================
// Add Beneficiary
// ==========================
exports.addBeneficiary = async (req, res) => {
  try {
    const { name, accountNumber, bankName, ifscCode } = req.body;

    if (!name || !accountNumber || !bankName || !ifscCode) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check duplicate beneficiary
    const existingBeneficiary = await Beneficiary.findOne({
      userId: req.userId,
      accountNumber,
    });

    if (existingBeneficiary) {
      return res.status(409).json({
        success: false,
        message: "Beneficiary already exists",
      });
    }

    // Optional: Limit beneficiaries per user
    const totalBeneficiaries = await Beneficiary.countDocuments({
      userId: req.userId,
    });

    if (totalBeneficiaries >= 100) {
      return res.status(400).json({
        success: false,
        message: "Beneficiary limit reached",
      });
    }

    const beneficiary = await Beneficiary.create({
      userId: req.userId,
      name: name.trim(),
      accountNumber: accountNumber.trim(),
      bankName: bankName.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
    });

    return res.status(201).json({
      success: true,
      message: "Beneficiary added successfully",
      beneficiary,
    });
  } catch (error) {
    console.error("Add Beneficiary Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================
// Get Beneficiaries
// ==========================
exports.getBeneficiaries = async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: beneficiaries.length,
      beneficiaries,
    });
  } catch (error) {
    console.error("Get Beneficiaries Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================
// Delete Beneficiary
// ==========================
exports.deleteBeneficiary = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        message: "Beneficiary not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Beneficiary deleted successfully",
    });
  } catch (error) {
    console.error("Delete Beneficiary Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};