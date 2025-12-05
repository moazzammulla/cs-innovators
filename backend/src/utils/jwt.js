const jwt = require('jsonwebtoken');

const signToken = (payload, options = {}) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign(payload, secret, { expiresIn: '7d', ...options });
};

const verifyTokenInternal = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.verify(token, secret);
};

module.exports = { signToken, verifyTokenInternal };
