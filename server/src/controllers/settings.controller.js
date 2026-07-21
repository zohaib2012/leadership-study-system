const Setting = require('../models/Setting');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const FeePayment = require('../models/FeePayment');
const Attendance = require('../models/Attendance');

exports.getSettings = async (req, res) => {
  try {
    const tenant = req.tenant._id;

    const settings = await Setting.find({ tenant }).lean();

    const result = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { settings } = req.body;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'settings object is required',
      });
    }

    const bulkOps = Object.entries(settings).map(([key, value]) => ({
      updateOne: {
        filter: { tenant, key },
        update: { $set: { key, value, updatedAt: new Date() } },
        upsert: true,
      },
    }));

    if (bulkOps.length > 0) {
      await Setting.bulkWrite(bulkOps);
    }

    const updated = await Setting.find({ tenant }).lean();

    const result = {};
    for (const s of updated) {
      result[s.key] = s.value;
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { role, page = 1, limit = 20 } = req.query;

    const filter = { tenant, role: { $ne: 'SUPER_ADMIN' } };

    if (role) filter.role = role;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -refreshToken -passwordResetToken -passwordResetExpires')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'name, email, password and role are required',
      });
    }

    const existing = await User.findOne({ tenant, email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      tenant,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      phone: phone || '',
    });

    res.status(201).json({ success: true, data: user.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { name, email, phone, role } = req.body;

    const user = await User.findOne({ _id: req.params.id, tenant });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (email && email !== user.email) {
      const duplicate = await User.findOne({
        tenant,
        email: email.toLowerCase().trim(),
        _id: { $ne: user._id },
      });
      if (duplicate) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      user.email = email.toLowerCase().trim();
    }

    if (name !== undefined) user.name = name.trim();
    if (phone !== undefined) user.phone = phone;
    if (role !== undefined) user.role = role;
    user.updatedAt = new Date();

    await user.save();

    res.json({ success: true, data: user.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, tenant: req.tenant._id },
      { $set: { status: 'INACTIVE', updatedAt: new Date() } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getActivityLogs = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { user: userId, action, page = 1, limit = 50 } = req.query;

    const filter = { tenant };

    if (userId) filter.user = userId;
    if (action) filter.action = action;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      ActivityLog.find(filter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      ActivityLog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBackup = async (req, res) => {
  try {
    const tenant = req.tenant._id;

    const [students, teachers, fees, attendance] = await Promise.all([
      Student.find({ tenant })
        .populate('class', 'name')
        .populate('section', 'name')
        .lean(),
      Teacher.find({ tenant })
        .populate('user', 'name email')
        .lean(),
      FeePayment.find({ tenant })
        .populate('student', 'firstName lastName registrationNo')
        .lean(),
      Attendance.find({ tenant })
        .populate('student', 'firstName lastName registrationNo')
        .populate('class', 'name')
        .lean(),
    ]);

    const backup = {
      exportedAt: new Date().toISOString(),
      tenant: tenant.toString(),
      data: {
        students,
        teachers,
        fees,
        attendance,
      },
    };

    res.json({ success: true, data: backup });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
