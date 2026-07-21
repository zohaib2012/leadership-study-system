const Teacher = require('../models/Teacher');
const User = require('../models/User');
const SalarySlip = require('../models/SalarySlip');
const { generateSlipNo } = require('../utils/helpers');

const requireTenant = (req) => {
  if (!req.tenant || !req.tenant._id) {
    return false;
  }
  return true;
};

exports.getTeachers = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const { page = 1, limit = 10, search, status } = req.query;
    const tenantId = req.tenant._id;
    const teacherFilter = { tenant: tenantId };

    if (status) {
      teacherFilter.status = status;
    }

    if (search) {
      const users = await User.find({
        tenant: tenantId,
        role: 'TEACHER',
        name: { $regex: search, $options: 'i' },
      }).select('_id');
      const userIds = users.map((u) => u._id);
      teacherFilter.user = { $in: userIds };
    }

    const total = await Teacher.countDocuments(teacherFilter);

    const teachers = await Teacher.find(teacherFilter)
      .populate('user')
      .populate('assignedClasses.class')
      .populate('assignedClasses.subject')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        teachers,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTeacher = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const teacher = await Teacher.findOne({
      _id: req.params.id,
      tenant: req.tenant._id,
    })
      .populate('user')
      .populate('assignedClasses.class')
      .populate('assignedClasses.subject');

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const {
      name,
      email,
      password,
      phone,
      qualification,
      experience,
      specialization,
      joinDate,
      salary,
      contractType,
      cnic,
      address,
    } = req.body;

    const tenantId = req.tenant._id;

    const existingUser = await User.findOne({ tenant: tenantId, email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      tenant: tenantId,
      name,
      email,
      password,
      phone,
      role: 'TEACHER',
    });

    const teacher = await Teacher.create({
      tenant: tenantId,
      user: user._id,
      qualification,
      experience,
      specialization,
      joinDate,
      salary,
      contractType,
      cnic,
      address,
    });

    const populated = await Teacher.findById(teacher._id)
      .populate('user')
      .populate('assignedClasses.class')
      .populate('assignedClasses.subject');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const {
      name,
      email,
      phone,
      qualification,
      experience,
      specialization,
      joinDate,
      salary,
      contractType,
      cnic,
      address,
      photo,
      assignedClasses,
      documents,
    } = req.body;

    const teacher = await Teacher.findOne({
      _id: req.params.id,
      tenant: req.tenant._id,
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    const teacherFields = [
      'qualification',
      'experience',
      'specialization',
      'joinDate',
      'salary',
      'contractType',
      'cnic',
      'address',
      'photo',
      'assignedClasses',
      'documents',
    ];

    teacherFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        teacher[field] = req.body[field];
      }
    });

    teacher.updatedAt = new Date();
    await teacher.save();

    if (name || email || phone !== undefined) {
      const user = await User.findById(teacher.user);
      if (user) {
        if (name) user.name = name;
        if (email) {
          const duplicate = await User.findOne({
            tenant: req.tenant._id,
            email,
            _id: { $ne: user._id },
          });
          if (duplicate) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
          }
          user.email = email;
        }
        if (phone !== undefined) user.phone = phone;
        user.updatedAt = new Date();
        await user.save();
      }
    }

    const populated = await Teacher.findById(teacher._id)
      .populate('user')
      .populate('assignedClasses.class')
      .populate('assignedClasses.subject');

    res.json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const teacher = await Teacher.findOneAndUpdate(
      { _id: req.params.id, tenant: req.tenant._id },
      { status: 'INACTIVE', updatedAt: new Date() },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTeacherSalary = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const teacherId = req.params.id || req.query.teacherId;

    const slips = await SalarySlip.find({
      teacher: teacherId,
      tenant: req.tenant._id,
    })
      .populate('teacher')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: slips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateSalarySlip = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const {
      teacherId,
      month,
      basicSalary,
      deductions = 0,
      bonuses = 0,
      remark,
      status,
    } = req.body;

    const teacher = await Teacher.findOne({
      _id: teacherId,
      tenant: req.tenant._id,
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    const existingSlip = await SalarySlip.findOne({
      teacher: teacherId,
      month,
      tenant: req.tenant._id,
    });

    if (existingSlip) {
      return res.status(400).json({
        success: false,
        message: 'Salary slip already exists for this month',
      });
    }

    const netSalary = basicSalary - deductions + bonuses;
    const slipNo = generateSlipNo();

    const salarySlip = await SalarySlip.create({
      teacher: teacherId,
      tenant: req.tenant._id,
      month,
      basicSalary,
      deductions,
      bonuses,
      netSalary,
      status: status || 'PENDING',
      slipNo,
      remark,
    });

    res.status(201).json({ success: true, data: salarySlip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
