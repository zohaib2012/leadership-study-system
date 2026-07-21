const mongoose = require('mongoose');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Attendance = require('../models/Attendance');
const FeePayment = require('../models/FeePayment');
const FeeChallan = require('../models/FeeChallan');
const Class = require('../models/Class');

exports.getAdmissionReport = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { startDate, endDate, class: classId } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchFilter = { tenant: new mongoose.Types.ObjectId(tenant) };
    if (Object.keys(dateFilter).length > 0) {
      matchFilter.createdAt = dateFilter;
    }
    if (classId) {
      matchFilter.class = new mongoose.Types.ObjectId(classId);
    }

    const admissionsByMonth = await Student.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const admissionsByClass = await Student.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$class',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'classes',
          localField: '_id',
          foreignField: '_id',
          as: 'classData',
        },
      },
      { $unwind: { path: '$classData', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          classId: '$_id',
          className: '$classData.name',
          count: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        admissionsByMonth: admissionsByMonth.map((m) => ({
          year: m._id.year,
          month: m._id.month,
          count: m.count,
        })),
        admissionsByClass,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAttendanceReport = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { startDate, endDate, class: classId, student: studentId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate and endDate are required',
      });
    }

    const matchFilter = {
      tenant: new mongoose.Types.ObjectId(tenant),
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    };

    if (classId) matchFilter.class = new mongoose.Types.ObjectId(classId);
    if (studentId) matchFilter.student = new mongoose.Types.ObjectId(studentId);

    if (classId) {
      const stats = await Attendance.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: { class: '$class', student: '$student' },
            total: { $sum: 1 },
            present: {
              $sum: {
                $cond: [{ $in: ['$status', ['PRESENT', 'LATE', 'HALF_DAY']] }, 1, 0],
              },
            },
          },
        },
      ]);

      const classTotals = {};
      for (const s of stats) {
        const cid = s._id.class.toString();
        if (!classTotals[cid]) classTotals[cid] = { total: 0, present: 0 };
        classTotals[cid].present += s.present;
        classTotals[cid].total += s.total;
      }

      const classes = await Class.find({
        _id: { $in: Object.keys(classTotals).map((id) => new mongoose.Types.ObjectId(id)) },
      }).select('name');

      const classMap = {};
      for (const c of classes) classMap[c._id.toString()] = c.name;

      const result = Object.entries(classTotals).map(([cid, s]) => ({
        classId: cid,
        className: classMap[cid] || 'Unknown',
        totalDays: s.total,
        presentDays: s.present,
        absentDays: s.total - s.present,
        percentage: s.total > 0 ? Math.round((s.present / s.total) * 100) : 0,
      }));

      return res.json({ success: true, data: result });
    }

    if (studentId) {
      const records = await Attendance.find({
        tenant,
        student: studentId,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      });

      const total = records.length;
      const present = records.filter((r) =>
        ['PRESENT', 'LATE', 'HALF_DAY'].includes(r.status)
      ).length;

      return res.json({
        success: true,
        data: {
          studentId,
          totalDays: total,
          presentDays: present,
          absentDays: total - present,
          percentage: total > 0 ? Math.round((present / total) * 100) : 0,
        },
      });
    }

    const stats = await Attendance.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$class',
          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $in: ['$status', ['PRESENT', 'LATE', 'HALF_DAY']] }, 1, 0],
            },
          },
        },
      },
    ]);

    const classIds = stats.map((s) => s._id);
    const classes = await Class.find({
      _id: { $in: classIds },
    }).select('name');

    const classMap = {};
    for (const c of classes) classMap[c._id.toString()] = c.name;

    const result = stats.map((s) => ({
      classId: s._id,
      className: classMap[s._id.toString()] || 'Unknown',
      totalDays: s.total,
      presentDays: s.present,
      absentDays: s.total - s.present,
      percentage: s.total > 0 ? Math.round((s.present / s.total) * 100) : 0,
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeeReport = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const paymentMatch = { tenant: new mongoose.Types.ObjectId(tenant) };
    if (Object.keys(dateFilter).length > 0) {
      paymentMatch.paidAt = dateFilter;
    }

    const [dailyCollection, monthlySummary, pendingByClass] = await Promise.all([
      FeePayment.aggregate([
        { $match: paymentMatch },
        {
          $group: {
            _id: {
              year: { $year: '$paidAt' },
              month: { $month: '$paidAt' },
              day: { $dayOfMonth: '$paidAt' },
            },
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      ]),
      FeePayment.aggregate([
        { $match: paymentMatch },
        {
          $group: {
            _id: {
              year: { $year: '$paidAt' },
              month: { $month: '$paidAt' },
            },
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      FeeChallan.aggregate([
        { $match: { tenant: new mongoose.Types.ObjectId(tenant), status: { $in: ['PENDING', 'PARTIAL', 'OVERDUE'] } } },
        {
          $lookup: {
            from: 'students',
            localField: 'student',
            foreignField: '_id',
            as: 'studentData',
          },
        },
        { $unwind: { path: '$studentData', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$studentData.class',
            totalPending: { $sum: { $subtract: ['$totalAmount', { $ifNull: ['$paidAmount', 0] }] } },
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'classes',
            localField: '_id',
            foreignField: '_id',
            as: 'classData',
          },
        },
        { $unwind: { path: '$classData', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            classId: '$_id',
            className: '$classData.name',
            totalPending: 1,
            count: 1,
          },
        },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        dailyCollection,
        monthlySummary,
        pendingByClass,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentReport = async (req, res) => {
  try {
    const tenant = req.tenant._id;
    const { status, class: classId, type } = req.query;

    const filter = { tenant };

    if (status) filter.status = status;
    if (classId) filter.class = classId;
    if (type) filter.type = type;

    const students = await Student.find(filter)
      .populate('class', 'name')
      .populate('section', 'name')
      .populate('subjects', 'name')
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

exports.getTeacherReport = async (req, res) => {
  try {
    const tenant = req.tenant._id;

    const teachers = await Teacher.find({ tenant })
      .populate('user', 'name email phone')
      .lean();

    const data = teachers.map((t) => ({
      ...t,
      workload: {
        assignedClasses: t.assignedClasses ? t.assignedClasses.length : 0,
      },
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const tenant = req.tenant._id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [
      totalStudents,
      totalTeachers,
      todayAttendance,
      todaysCollections,
      monthlyFeeCollection,
      studentsByClass,
      recentAdmissions,
    ] = await Promise.all([
      Student.countDocuments({ tenant, status: 'ACTIVE' }),
      Teacher.countDocuments({ tenant, status: 'ACTIVE' }),
      (async () => {
        const records = await Attendance.find({
          tenant,
          date: { $gte: startOfDay, $lte: endOfDay },
        });
        const total = records.length;
        const present = records.filter((r) =>
          ['PRESENT', 'LATE', 'HALF_DAY'].includes(r.status)
        ).length;
        return {
          total,
          present,
          absent: total - present,
          percentage: total > 0 ? Math.round((present / total) * 100) : 0,
        };
      })(),
      FeePayment.aggregate([
        {
          $match: {
            tenant: new mongoose.Types.ObjectId(tenant),
            paidAt: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]).then((r) => (r.length > 0 ? r[0] : { total: 0, count: 0 })),
      FeePayment.aggregate([
        {
          $match: {
            tenant: new mongoose.Types.ObjectId(tenant),
            paidAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$paidAt' },
              month: { $month: '$paidAt' },
            },
            total: { $sum: '$amount' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Student.aggregate([
        { $match: { tenant: new mongoose.Types.ObjectId(tenant), status: 'ACTIVE' } },
        {
          $group: {
            _id: '$class',
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'classes',
            localField: '_id',
            foreignField: '_id',
            as: 'classData',
          },
        },
        { $unwind: { path: '$classData', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            classId: '$_id',
            className: '$classData.name',
            count: 1,
          },
        },
      ]),
      Student.find({ tenant, status: 'ACTIVE' })
        .populate('class', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    res.json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        todayAttendance,
        todaysCollections,
        monthlyFeeCollection,
        studentsByClass,
        recentAdmissions,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
