const User = require("../models/User");

// ==========================
// Get User Profile
// ==========================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================
// Update User Profile
// ==========================
exports.updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      dateOfBirth,
      address,
      occupation,
    } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (fullName !== undefined)
      user.fullName = fullName.trim();

    if (phone !== undefined)
      user.phone = phone.trim();

    if (dateOfBirth !== undefined)
      user.dateOfBirth = dateOfBirth;

    if (address !== undefined)
      user.address = address.trim();

    if (occupation !== undefined)
      user.occupation = occupation.trim();

    await user.save();

    const updatedUser = await User.findById(req.userId).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================
// Upload Profile Photo
// ==========================
exports.uploadPhoto = async (req, res) => {
  try {
    const { photo } = req.body;

    if (!photo) {
      return res.status(400).json({
        success: false,
        message: "Profile photo is required",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Basic Base64 validation
    if (!photo.startsWith("data:image")) {
      return res.status(400).json({
        success: false,
        message: "Invalid image format",
      });
    }

    user.profilePhoto = photo;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile photo uploaded successfully",
      profilePhoto: user.profilePhoto,
    });
  } catch (error) {
    console.error("Upload Photo Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================
// Delete Profile Photo
// ==========================
exports.deletePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.profilePhoto = "";

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile photo removed successfully",
    });
  } catch (error) {
    console.error("Delete Photo Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};