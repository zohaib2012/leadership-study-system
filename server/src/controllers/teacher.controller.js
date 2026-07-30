const Teacher = require('../models/Teacher');
const User = require('../models/User');
const Student = require('../models/Student');
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
      assignedClasses,
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
      assignedClasses: assignedClasses || [],
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

exports.getMyClasses = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const teacher = await Teacher.findOne({
      user: req.user._id,
      tenant: req.tenant._id,
    })
      .populate({ path: 'assignedClasses.class', select: 'name section' })
      .populate({ path: 'assignedClasses.subject', select: 'name' })
      .lean();

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    const classIds = (teacher.assignedClasses || [])
      .filter(a => a.class)
      .map(a => a.class._id);

    const [studentCounts, studentsByClass] = await Promise.all([
      classIds.length > 0
        ? Student.aggregate([
            { $match: { tenant: req.tenant._id, class: { $in: classIds }, status: 'ACTIVE' } },
            { $group: { _id: '$class', count: { $sum: 1 } } },
          ])
        : [],
      classIds.length > 0
        ? Student.find({ tenant: req.tenant._id, class: { $in: classIds }, status: 'ACTIVE' })
            .select('firstName lastName registrationNo photo class')
            .lean()
        : [],
    ]);

    const countMap = {};
    studentCounts.forEach(item => { countMap[item._id.toString()] = item.count; });

    const studentsMap = {};
    studentsByClass.forEach(s => {
      const key = s.class.toString();
      if (!studentsMap[key]) studentsMap[key] = [];
      studentsMap[key].push({ _id: s._id, firstName: s.firstName, lastName: s.lastName, registrationNo: s.registrationNo });
    });

    const classes = (teacher.assignedClasses || [])
      .filter(a => a.class)
      .map(a => ({
        _id: a.class._id,
        name: a.class.name,
        section: a.class.section,
        subject: a.subject?.name || '',
        studentCount: countMap[a.class._id.toString()] || 0,
        students: studentsMap[a.class._id.toString()] || [],
      }));

    res.json({ success: true, data: classes });
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

exports.getMySalary = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const teacher = await Teacher.findOne({
      user: req.user._id,
      tenant: req.tenant._id,
    }).lean();

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    res.json({ success: true, data: { salary: teacher.salary || 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMySlips = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const teacher = await Teacher.findOne({
      user: req.user._id,
      tenant: req.tenant._id,
    }).select('_id').lean();

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    const slips = await SalarySlip.find({
      teacher: teacher._id,
      tenant: req.tenant._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: slips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSalarySlips = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const { month, status, teacherId, page = 1, limit = 50 } = req.query;
    const filter = { tenant: req.tenant._id };

    if (month) filter.month = month;
    if (status) filter.status = status;
    if (teacherId) filter.teacher = teacherId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [slips, total] = await Promise.all([
      SalarySlip.find(filter)
        .populate({ path: 'teacher', select: 'salary', populate: { path: 'user', select: 'name email phone' } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      SalarySlip.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: slips,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSalarySlip = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const slip = await SalarySlip.findOne({ _id: req.params.id, tenant: req.tenant._id })
      .populate({ path: 'teacher', select: 'salary', populate: { path: 'user', select: 'name email phone' } })
      .lean();

    if (!slip) {
      return res.status(404).json({ success: false, message: 'Salary slip not found' });
    }

    res.json({ success: true, data: slip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markSlipPaid = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const slip = await SalarySlip.findOneAndUpdate(
      { _id: req.params.id, tenant: req.tenant._id },
      { $set: { status: 'PAID', paidAt: new Date() } },
      { new: true }
    );

    if (!slip) {
      return res.status(404).json({ success: false, message: 'Salary slip not found' });
    }

    res.json({ success: true, data: slip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkGenerateSlips = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const { month, teacherIds } = req.body;

    if (!month) {
      return res.status(400).json({ success: false, message: 'Month is required (YYYY-MM)' });
    }

    const filter = { tenant: req.tenant._id, status: 'ACTIVE' };
    if (teacherIds && Array.isArray(teacherIds) && teacherIds.length) {
      filter._id = { $in: teacherIds };
    }

    const teachers = await Teacher.find(filter).select('_id salary').lean();

    if (!teachers.length) {
      return res.status(400).json({ success: false, message: 'No active teachers found' });
    }

    const existingSlips = await SalarySlip.find({
      tenant: req.tenant._id,
      month,
      teacher: { $in: teachers.map((t) => t._id) },
    }).select('teacher').lean();

    const existingTeacherIds = new Set(existingSlips.map((s) => s.teacher.toString()));

    const newTeachers = teachers.filter((t) => !existingTeacherIds.has(t._id.toString()));

    if (!newTeachers.length) {
      return res.json({ success: true, data: { generated: 0, message: 'All teachers already have slips for this month' } });
    }

    const slips = [];
    for (const teacher of newTeachers) {
      let slipNo = generateSlipNo();
      let attempts = 0;
      while (attempts < 5) {
        const exists = await SalarySlip.findOne({ slipNo });
        if (!exists) break;
        slipNo = generateSlipNo();
        attempts++;
      }

      slips.push({
        teacher: teacher._id,
        tenant: req.tenant._id,
        month,
        basicSalary: teacher.salary || 0,
        deductions: 0,
        bonuses: 0,
        netSalary: teacher.salary || 0,
        status: 'PENDING',
        slipNo,
      });
    }

    await SalarySlip.insertMany(slips);

    res.status(201).json({ success: true, data: { generated: slips.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSalarySlip = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const { deductions, bonuses, remark } = req.body;

    const slip = await SalarySlip.findOne({ _id: req.params.id, tenant: req.tenant._id });

    if (!slip) {
      return res.status(404).json({ success: false, message: 'Salary slip not found' });
    }

    if (slip.status === 'PAID') {
      return res.status(400).json({ success: false, message: 'Cannot modify a paid slip' });
    }

    if (deductions !== undefined) slip.deductions = deductions;
    if (bonuses !== undefined) slip.bonuses = bonuses;
    if (remark !== undefined) slip.remark = remark;
    slip.netSalary = slip.basicSalary - slip.deductions + slip.bonuses;
    slip.updatedAt = new Date();

    await slip.save();

    const updated = await SalarySlip.findById(slip._id)
      .populate({ path: 'teacher', select: 'salary', populate: { path: 'user', select: 'name email phone' } })
      .lean();

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkMarkPaid = async (req, res) => {
  try {
    if (!requireTenant(req)) {
      return res.status(400).json({ success: false, message: 'Tenant context required' });
    }

    const { month, slipIds } = req.body;
    const filter = { tenant: req.tenant._id, status: 'PENDING' };

    if (month) filter.month = month;
    if (slipIds && Array.isArray(slipIds) && slipIds.length) {
      filter._id = { $in: slipIds };
    }

    const result = await SalarySlip.updateMany(
      filter,
      { $set: { status: 'PAID', paidAt: new Date() } }
    );

    res.json({ success: true, data: { modifiedCount: result.modifiedCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
