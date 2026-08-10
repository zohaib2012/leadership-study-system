const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }

  try {
    req.user = await User.findById(decoded.id).populate('tenant');
  } catch (error) {
    console.error('protect: DB error', error.message);
    return res.status(503).json({ success: false, message: 'Service temporarily unavailable, please try again' });
  }

  if (!req.user) {
    return res.status(401).json({ success: false, message: 'User not found' });
  }
  if (req.user.status !== 'ACTIVE') {
    return res.status(401).json({ success: false, message: 'Account is inactive or suspended' });
  }

  req.tenant = req.user.tenant;
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `Role '${req.user?.role}' is not authorized` });
    }
    next();
  };
};

const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).populate('tenant');
    } catch {
      req.user = null;
    }
  }
  next();
};

module.exports = { protect, authorize, optionalAuth };
