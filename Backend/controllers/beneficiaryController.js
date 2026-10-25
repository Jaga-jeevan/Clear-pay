const Beneficiary = require('../models/Beneficiary');

// Add beneficiary
exports.addBeneficiary = async (req, res) => {
  try {
    const { name, accountNumber, bankName, ifscCode } = req.body;

    const beneficiary = new Beneficiary({
      userId: req.userId,
      name,
      accountNumber,
      bankName,
      ifscCode
    });

    await beneficiary.save();

    res.status(201).json(beneficiary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all beneficiaries for user
exports.getBeneficiaries = async (req, res) => {
  try {const beneficiaries = await Beneficiary.find({ userId: req.userId }).sort({ addedAt: -1 });
    res.json(beneficiaries);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete beneficiary
exports.deleteBeneficiary = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!beneficiary) {
      return res.status(404).json({ error: 'Beneficiary not found' });
    }

    res.json({ message: 'Beneficiary deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};