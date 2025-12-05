const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify Bearer token and attach user to request
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [, token] = authHeader.split(' ');

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res
        .status(500)
        .json({ success: false, message: 'JWT secret not configured on server' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found for token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('verifyToken error:', error);
    return res.status(500).json({ success: false, message: 'Authentication failed' });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      if (req.user.role !== role && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
      }
      next();
    } catch (error) {
      console.error('requireRole error:', error);
      return res.status(500).json({ success: false, message: 'Role validation failed' });
    }
  };
};

module.exports = { verifyToken, requireRole };
