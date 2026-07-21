const hasTenant = (req, res, next) => {
  if (!req.tenant) {
    return res.status(400).json({ success: false, message: 'Tenant context required' });
  }
  next();
};

module.exports = hasTenant;
