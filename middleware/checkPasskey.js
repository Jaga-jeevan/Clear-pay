const checkPasskey = (req, res, next) => {
  const sessionPasskey = req.header("X-Session-Passkey");

  // Passkey missing
  if (!sessionPasskey) {
    return res.status(403).json({
      success: false,
      message: "Session passkey is required",
    });
  }

  // Passkey not configured
  if (!process.env.ADMIN_SESSION_PASSKEY) {
    console.error("❌ ADMIN_SESSION_PASSKEY is missing in .env");

    return res.status(500).json({
      success: false,
      message: "Server configuration error",
    });
  }

  // Invalid passkey
  if (sessionPasskey !== process.env.ADMIN_SESSION_PASSKEY) {
    return res.status(403).json({
      success: false,
      message: "Invalid session passkey",
    });
  }

  next();
};

module.exports = checkPasskey;