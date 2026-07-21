const Tenant = require('../models/Tenant');

const tenantContext = async (req, res, next) => {
  const host = req.get('host') || '';
  const parts = host.split('.');
  const subdomain = parts[0];

  const mainDomains = ['localhost', 'www', 'leadershipstudysystem', 'lss', '127'];

  if (mainDomains.includes(subdomain) || process.env.NODE_ENV === 'development' && !subdomain) {
    req.tenant = null;
    req.isMainDomain = true;
    return next();
  }

  try {
    const tenant = await Tenant.findOne({
      subdomain,
      status: { $ne: 'SUSPENDED' },
    });

    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Institute not found' });
    }

    req.tenant = tenant;
    req.isMainDomain = false;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = tenantContext;
