const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, dateOfBirth, address, occupation } = req.body;const user = await User.findById(req.userId);

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (address) user.address = address;
    if (occupation) user.occupation = occupation;

    await user.save();

    const updatedUser = await User.findById(req.userId).select('-password');

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' }); }
};

// Upload profile photo (base64)
exports.uploadPhoto = async (req, res) => {
  try {
    const { photo } = req.body; // base64 string

    if (!photo) {
      return res.status(400).json({ error: 'No photo provided' });
    }

    const user = await User.findById(req.userId);
    user.profilePhoto = photo;
    await user.save(); res.json({ message: 'Profile photo uploaded successfully', photo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};