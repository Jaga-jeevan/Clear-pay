const Settings = require("../models/Settings");

// ==========================
// Get User Settings
// ==========================
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({
      userId: req.userId,
    });

    if (!settings) {
      settings = await Settings.create({
        userId: req.userId,
      });
    }

    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Get Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================
// Update Settings
// ==========================
exports.updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne({
      userId: req.userId,
    });

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Settings not found",
      });
    }

    const {
      notifications,
      security,
      preferences,
    } = req.body;

    if (notifications) {
      settings.notifications = {
        ...settings.notifications,
        ...notifications,
      };
    }

    if (security) {
      settings.security = {
        ...settings.security,
        ...security,
      };
    }

    if (preferences) {
      settings.preferences = {
        ...settings.preferences,
        ...preferences,
      };
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Update Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================
// Reset Settings
// ==========================
exports.resetSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({
      userId: req.userId,
    });

    if (!settings) {
      settings = await Settings.create({
        userId: req.userId,
      });
    }

    settings.notifications = {
      email: true,
      sms: true,
      push: true,
    };

    settings.security = {
      twoFactorAuth: false,
      loginAlerts: true,
    };

    settings.preferences = {
      language: "en",
      theme: "system",
    };

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Settings reset successfully",
      settings,
    });
  } catch (error) {
    console.error("Reset Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================
// Toggle Two Factor Auth
// ==========================
exports.toggleTwoFactor = async (req, res) => {
  try {
    const settings = await Settings.findOne({
      userId: req.userId,
    });

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Settings not found",
      });
    }

    settings.security.twoFactorAuth =
      !settings.security.twoFactorAuth;

    await settings.save();

    return res.status(200).json({
      success: true,
      message: `Two-Factor Authentication ${
        settings.security.twoFactorAuth ? "Enabled" : "Disabled"
      }`,
      enabled: settings.security.twoFactorAuth,
    });
  } catch (error) {
    console.error("Toggle 2FA Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================
// Change Theme
// ==========================
exports.changeTheme = async (req, res) => {
  try {
    const { theme } = req.body;

    const allowedThemes = [
      "light",
      "dark",
      "system",
    ];

    if (!allowedThemes.includes(theme)) {
      return res.status(400).json({
        success: false,
        message: "Invalid theme",
      });
    }

    const settings = await Settings.findOne({
      userId: req.userId,
    });

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Settings not found",
      });
    }

    settings.preferences.theme = theme;

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Theme updated successfully",
      theme,
    });
  } catch (error) {
    console.error("Change Theme Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};