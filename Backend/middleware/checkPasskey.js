// Middleware to check session passkey (optional security layer)
const checkPasskey = (req, res, next) => {
  const sessionPasskey = req.header('X-Session-Passkey');
  
  // For demo: Allow if passkey matches or skip if not in production
  if (process.env.NODE_ENV === 'production' && !sessionPasskey) {
    return res.status(403).json({ error: 'Session passkey required' });
  }

  // In production, validate against session store
  next();
};

module.exports = checkPasskey;