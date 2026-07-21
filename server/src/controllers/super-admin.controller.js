const Tenant = require('../models/Tenant');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const TenantSubscription = require('../models/TenantSubscription');
const User = require('../models/User');
const Student = require('../models/Student');
const ActivityLog = require('../models/ActivityLog');
const FeePayment = require('../models/FeePayment');
const { generateToken } = require('../utils/jwt');

const superAdminController = {
  getDashboard: async (req, res) => {
    try {
      const totalTenants = await Tenant.countDocuments();
      const activeTenants = await Tenant.countDocuments({ status: 'ACTIVE' });
      const trialTenants = await Tenant.countDocuments({ status: 'TRIAL' });
      const totalStudents = await Student.countDocuments();
      const recentTenants = await Tenant.find().sort({ createdAt: -1 }).limit(5);
      const totalRevenue = await FeePayment.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);

      res.json({
        success: true,
        data: {
          totalTenants,
          activeTenants,
          trialTenants,
          totalStudents,
          totalRevenue: totalRevenue[0]?.total || 0,
          recentTenants,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getTenants: async (req, res) => {
    try {
      const { page = 1, limit = 10, search, status, plan } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const query = {};
      if (search) query.name = { $regex: search, $options: 'i' };
      if (status) query.status = status;

      const tenants = await Tenant.find(query)
        .populate('plan')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      for (const tenant of tenants) {
        tenant.studentCount = await Student.countDocuments({ tenant: tenant._id });
      }

      const total = await Tenant.countDocuments(query);

      res.json({
        success: true,
        data: tenants,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getTenant: async (req, res) => {
    try {
      const tenant = await Tenant.findById(req.params.id).populate('plan').lean();
      if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found' });

      tenant.studentCount = await Student.countDocuments({ tenant: tenant._id });
      tenant.teacherCount = await User.countDocuments({ tenant: tenant._id, role: 'TEACHER' });

      res.json({ success: true, data: tenant });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateTenant: async (req, res) => {
    try {
      const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found' });
      res.json({ success: true, data: tenant });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateTenantStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const tenant = await Tenant.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found' });
      res.json({ success: true, data: tenant });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  loginAsTenant: async (req, res) => {
    try {
      const tenant = await Tenant.findById(req.params.id);
      if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found' });

      const admin = await User.findOne({ tenant: tenant._id, role: 'ADMIN' });
      if (!admin) return res.status(404).json({ success: false, message: 'No admin found for this tenant' });

      const token = generateToken(admin._id, admin.role, admin.tenant);
      res.json({ success: true, data: { token, user: admin, tenant } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getPlans: async (req, res) => {
    try {
      const plans = await SubscriptionPlan.find({ isActive: true });
      res.json({ success: true, data: plans });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  createPlan: async (req, res) => {
    try {
      const plan = await SubscriptionPlan.create(req.body);
      res.status(201).json({ success: true, data: plan });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updatePlan: async (req, res) => {
    try {
      const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
      res.json({ success: true, data: plan });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deletePlan: async (req, res) => {
    try {
      const plan = await SubscriptionPlan.findByIdAndDelete(req.params.id);
      if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
      res.json({ success: true, message: 'Plan deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getSubscriptions: async (req, res) => {
    try {
      const subscriptions = await TenantSubscription.find()
        .populate('tenant')
        .populate('plan')
        .sort({ createdAt: -1 });
      res.json({ success: true, data: subscriptions });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getRevenueReport: async (req, res) => {
    try {
      const monthlyRevenue = await FeePayment.aggregate([
        {
          $group: {
            _id: { $substr: ['$paidAt', 0, 7] },
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.total, 0);

      res.json({ success: true, data: { monthlyRevenue, totalRevenue } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getGlobalLogs: async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const logs = await ActivityLog.find()
        .populate('user', 'name email role')
        .populate('tenant', 'name subdomain')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await ActivityLog.countDocuments();

      res.json({
        success: true,
        data: logs,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = superAdminController;
