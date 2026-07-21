const crypto = require('crypto');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const emailService = require('../utils/email');

exports.login = async (req, res) => {
  try {
    const { email, password, tenantId } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    let user;
    if (tenantId) {
      user = await User.findOne({ email: email.toLowerCase().trim(), tenant: tenantId });
    } else {
      const users = await User.find({ email: email.toLowerCase().trim() });
      if (users.length === 1) {
        user = users[0];
      } else if (users.length > 1) {
        return res.status(400).json({
          success: false,
          message: 'Multiple accounts found. Please specify your institute.',
          tenants: users.map((u) => ({ id: u.tenant, name: '' })),
        });
      }
    }
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(401).json({ success: false, message: 'Account is inactive. Contact your administrator.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role, user.tenant);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.lastLoginAt = new Date();
    user.lastLoginIp = req.ip;
    await user.save();

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        token,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, tenantId } = req.body;

    if (!name || !email || !password || !tenantId) {
      return res.status(400).json({ success: false, message: 'Name, email, password and tenant are required' });
    }

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim(), tenant: tenantId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists in this tenant' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone,
      tenant: tenantId,
      role: 'ADMIN',
      status: 'ACTIVE',
    });

    const token = generateToken(user._id, user.role, user.tenant);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    try {
      await emailService.sendWelcome(user.email, user.name, tenant.name);
    } catch {
      // email failure is non-critical
    }

    res.status(201).json({
      success: true,
      data: {
        user: user.toJSON(),
        token,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerTenant = async (req, res) => {
  try {
    const {
      instituteName, tenantName,
      subdomain, instituteType, type,
      city,
      phone,
      adminName, email, adminEmail,
      adminPassword, password,
      planId,
    } = req.body;

    const finalTenantName = tenantName || instituteName || 'New Institute';
    const finalSubdomain = subdomain || finalTenantName.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + Date.now().toString(36);
    const finalType = type || instituteType?.toUpperCase() || 'BOTH';
    const finalAdminName = adminName || finalTenantName + ' Admin';
    const finalAdminEmail = email || adminEmail;
    const finalAdminPassword = password || adminPassword || 'admin123';

    if (!finalAdminEmail || !finalAdminPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    if (!subdomain) {
      const exists = await Tenant.findOne({ subdomain: finalSubdomain });
      if (exists) {
        return res.status(400).json({ success: false, message: 'Subdomain is already taken. Please provide a unique institute name.' });
      }
    }

    const existingTenant = await Tenant.findOne({ subdomain: finalSubdomain.toLowerCase().trim() });
    if (existingTenant) {
      return res.status(400).json({ success: false, message: 'Subdomain is already taken' });
    }

    let plan = null;
    if (planId) {
      plan = await SubscriptionPlan.findById(planId);
    }

    const tenant = await Tenant.create({
      name: finalTenantName.trim(),
      subdomain: finalSubdomain.toLowerCase().trim(),
      type: finalType,
      city,
      phone,
      plan: plan ? plan._id : undefined,
      status: 'TRIAL',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    const user = await User.create({
      name: finalAdminName.trim(),
      email: finalAdminEmail.toLowerCase().trim(),
      password: finalAdminPassword,
      tenant: tenant._id,
      role: 'ADMIN',
      status: 'ACTIVE',
    });

    const token = generateToken(user._id, user.role, user.tenant);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    try {
      await emailService.sendWelcome(user.email, user.name, tenant.name);
    } catch {
      // email failure is non-critical
    }

    res.status(201).json({
      success: true,
      data: {
        tenant,
        user: user.toJSON(),
        plan: plan ? plan.toJSON() : null,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, tenantId } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    let query = { email: email.toLowerCase().trim() };
    if (tenantId) query.tenant = tenantId;

    const user = await User.findOne(query);
    if (!user) {
      return res.status(200).json({ success: true, message: 'If the email exists, a reset link has been sent' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}?tenant=${tenantId}`;

    try {
      await emailService.sendPasswordReset(user.email, resetUrl);
    } catch {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      return res.status(500).json({ success: false, message: 'Failed to send password reset email' });
    }

    res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password, tenantId } = req.body;

    if (!token || !password || !tenantId) {
      return res.status(400).json({ success: false, message: 'Token, new password and tenant are required' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
      tenant: tenantId,
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.json({ success: true, data: req.user.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, image } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name !== undefined) user.name = name.trim();
    if (phone !== undefined) user.phone = phone;
    if (image !== undefined) user.image = image;
    user.updatedAt = new Date();

    await user.save();

    res.json({ success: true, data: user.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    user.refreshToken = undefined;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
