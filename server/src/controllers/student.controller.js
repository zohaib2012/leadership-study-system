const mongoose = require('mongoose');
const Student = require('../models/Student');
const User = require('../models/User');
const FeeChallan = require('../models/FeeChallan');
const FeePayment = require('../models/FeePayment');
const Attendance = require('../models/Attendance');
const ClassModel = require('../models/Class');
const { generateRegistrationNo } = require('../utils/helpers');

const Section = ClassModel.Section;

const enrollmentSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  fromClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  toClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  fromSection: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  toSection: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  promotionDate: { type: Date, default: Date.now },
  remark: String,
  createdAt: { type: Date, default: Date.now },
});

const StudentEnrollment = mongoose.models.StudentEnrollment || mongoose.model('StudentEnrollment', enrollmentSchema);

exports.getStudents = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const {
      page = 1,
      limit = 10,
      search,
      class: classId,
      section: sectionId,
      status,
      type,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const filter = { tenant };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { registrationNo: searchRegex },
      ];
    }

    if (classId) filter.class = classId;
    if (sectionId) filter.section = sectionId;
    if (status) filter.status = status;
    if (type) filter.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortField = sortBy === 'name' ? 'firstName' : sortBy;
    const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

    const [students, total] = await Promise.all([
      Student.find(filter)
        .populate('class')
        .populate('section')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Student.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: students,
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

exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      tenant: req.tenant._id,
    })
      .populate('class')
      .populate('section')
      .populate('subjects')
      .populate('parents.parent');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createStudent = async (req, res) => {
  let user;
  try {
    const tenant = req.tenant._id;
    const tenantDoc = req.tenant;

    const registrationNo = generateRegistrationNo(
      req.body.type === 'ACADEMY' ? 'ACADEMY' : 'SCHOOL'
    );

    const studentEmail =
      req.body.email || `${registrationNo}@${tenantDoc.subdomain || 'tenant'}.lss.edu`;

    const password = req.body.password || 'student123';

    const existingUser = await User.findOne({ tenant, email: studentEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'A user with this email already exists' });
    }

    user = await User.create({
      tenant,
      name: `${req.body.firstName} ${req.body.lastName}`,
      email: studentEmail,
      password,
      phone: req.body.fatherPhone || req.body.motherPhone,
      role: 'STUDENT',
      image: req.body.photo,
    });

    const studentData = {
      tenant,
      user: user._id,
      registrationNo,
      ...req.body,
    };
    delete studentData.email;
    delete studentData.password;

    const student = await Student.create(studentData);

    const populated = await Student.findById(student._id)
      .populate('class')
      .populate('section')
      .populate('subjects')
      .populate('parents.parent');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (user) {
      await User.findByIdAndDelete(user._id).catch(() => {});
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const updates = { ...req.body, updatedAt: new Date() };

    delete updates.registrationNo;
    delete updates.tenant;
    delete updates.user;
    delete updates.email;
    delete updates.password;

    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, tenant: req.tenant._id },
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('class')
      .populate('section')
      .populate('subjects')
      .populate('parents.parent');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (updates.firstName || updates.lastName) {
      await User.findByIdAndUpdate(student.user, {
        name: `${student.firstName} ${student.lastName}`,
        updatedAt: new Date(),
      });
    }

    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const newStatus = req.body.status || 'INACTIVE';

    if (!['INACTIVE', 'TRANSFERRED'].includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be INACTIVE or TRANSFERRED',
      });
    }

    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, tenant: req.tenant._id },
      {
        $set: {
          status: newStatus,
          leavingDate: newStatus === 'TRANSFERRED' ? new Date() : undefined,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (student.user) {
      await User.findByIdAndUpdate(student.user, {
        status: 'INACTIVE',
        updatedAt: new Date(),
      });
    }

    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkImport = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const tenantDoc = req.tenant;
    const { students } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ success: false, message: 'students array is required' });
    }

    const created = [];

    for (const s of students) {
      const registrationNo = generateRegistrationNo(
        s.type === 'ACADEMY' ? 'ACADEMY' : 'SCHOOL'
      );

      const email = s.email || `${registrationNo}@${tenantDoc.subdomain || 'tenant'}.lss.edu`;

      let user;
      const existingUser = await User.findOne({ tenant, email });
      if (!existingUser) {
        user = await User.create({
          tenant,
          name: `${s.firstName} ${s.lastName}`,
          email,
          password: s.password || 'student123',
          phone: s.fatherPhone || s.motherPhone,
          role: 'STUDENT',
          image: s.photo,
        });
      } else {
        user = existingUser;
      }

      const studentData = {
        tenant,
        user: user._id,
        registrationNo,
        ...s,
      };
      delete studentData.email;
      delete studentData.password;

      const student = await Student.create(studentData);
      created.push(student._id);
    }

    const studentsCreated = await Student.find({ _id: { $in: created } })
      .populate('class')
      .populate('section')
      .lean();

    res.status(201).json({
      success: true,
      data: studentsCreated,
      pagination: { total: created.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentFees = async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;

    const filter = {
      student: req.params.id,
      tenant: req.tenant._id,
    };

    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [challans, total] = await Promise.all([
      FeeChallan.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      FeeChallan.countDocuments(filter),
    ]);

    const challanIds = challans.map((c) => c._id);
    const payments = await FeePayment.find({ challan: { $in: challanIds } })
      .populate('receivedBy', 'name')
      .lean();

    const paymentsByChallan = {};
    for (const p of payments) {
      const cid = p.challan.toString();
      if (!paymentsByChallan[cid]) paymentsByChallan[cid] = [];
      paymentsByChallan[cid].push(p);
    }

    const data = challans.map((c) => ({
      ...c,
      payments: paymentsByChallan[c._id.toString()] || [],
    }));

    res.json({
      success: true,
      data,
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

exports.getStudentAttendance = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 100 } = req.query;

    const filter = {
      student: req.params.id,
      tenant: req.tenant._id,
    };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [records, total] = await Promise.all([
      Attendance.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('markedBy', 'name')
        .populate('class', 'name')
        .lean(),
      Attendance.countDocuments(filter),
    ]);

    const stats = await Attendance.aggregate([
      { $match: { student: new mongoose.Types.ObjectId(req.params.id), tenant: req.tenant._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = {};
    let totalDays = 0;
    for (const s of stats) {
      summary[s._id] = s.count;
      totalDays += s.count;
    }
    summary.TOTAL = totalDays;

    res.json({
      success: true,
      data: records,
      summary,
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

exports.generateIdCard = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      tenant: req.tenant._id,
    })
      .populate('class', 'name type')
      .populate('section', 'name');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const tenantDoc = req.tenant;
    const idCardData = {
      student: {
        _id: student._id,
        registrationNo: student.registrationNo,
        fullName: student.fullName || `${student.firstName} ${student.lastName}`,
        firstName: student.firstName,
        lastName: student.lastName,
        dob: student.dob,
        gender: student.gender,
        bloodGroup: student.bloodGroup,
        photo: student.photo,
        bFormNo: student.bFormNo,
        fatherName: student.fatherName,
        fatherPhone: student.fatherPhone,
        address: student.address,
      },
      class: student.class
        ? { _id: student.class._id, name: student.class.name, type: student.class.type }
        : null,
      section: student.section
        ? { _id: student.section._id, name: student.section.name }
        : null,
      institute: {
        name: tenantDoc.name,
        logo: tenantDoc.logo,
        address: tenantDoc.address,
        phone: tenantDoc.phone,
        city: tenantDoc.city,
      },
    };

    res.json({ success: true, data: idCardData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.promoteStudents = async (req, res) => {
  try {
    const { studentIds, toClass, toSection, promotionDate } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, message: 'studentIds array is required' });
    }

    if (!toClass) {
      return res.status(400).json({ success: false, message: 'toClass is required' });
    }

    const tenant = req.tenant._id;
    const date = promotionDate ? new Date(promotionDate) : new Date();

    const students = await Student.find({
      _id: { $in: studentIds },
      tenant,
    });

    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'No students found' });
    }

    const enrollments = [];
    const updatedStudentIds = [];

    for (const student of students) {
      const fromClass = student.class;
      const fromSection = student.section;

      enrollments.push({
        tenant,
        student: student._id,
        fromClass,
        toClass,
        fromSection,
        toSection: toSection || null,
        promotionDate: date,
      });

      updatedStudentIds.push(student._id);
    }

    await StudentEnrollment.insertMany(enrollments);

    const updateData = { class: toClass, updatedAt: new Date() };
    if (toSection) updateData.section = toSection;

    await Student.updateMany(
      { _id: { $in: updatedStudentIds }, tenant },
      { $set: updateData }
    );

    const updatedStudents = await Student.find({ _id: { $in: updatedStudentIds } })
      .populate('class')
      .populate('section')
      .lean();

    res.json({
      success: true,
      data: updatedStudents,
      pagination: { total: updatedStudentIds.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportStudents = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { class: classId, section: sectionId, status, type } = req.query;

    const filter = { tenant };

    if (classId) filter.class = classId;
    if (sectionId) filter.section = sectionId;
    if (status) filter.status = status;
    if (type) filter.type = type;

    const students = await Student.find(filter)
      .populate('class', 'name type')
      .populate('section', 'name')
      .sort({ registrationNo: 1 })
      .lean();

    res.json({
      success: true,
      data: students,
      pagination: { total: students.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
