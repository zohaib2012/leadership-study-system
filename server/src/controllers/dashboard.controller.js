const mongoose = require('mongoose');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Attendance = require('../models/Attendance');
const FeeChallan = require('../models/FeeChallan');
const FeePayment = require('../models/FeePayment');
const Homework = require('../models/Homework');
const HomeworkSubmission = require('../models/HomeworkSubmission');
const Timetable = require('../models/Timetable');

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

exports.getAdminDashboard = async (req, res) => {
  try {
    const tenant = req.tenant._id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6, 1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [
      totalStudents,
      totalTeachers,
      todayAttendanceRecords,
      monthlyFeeTotal,
      pendingFeesTotal,
      recentStudents,
      classWiseStudents,
      monthlyFeeTrend,
    ] = await Promise.all([
      Student.countDocuments({ tenant, status: 'ACTIVE' }),
      Teacher.countDocuments({ tenant, status: 'ACTIVE' }),
      Attendance.find({
        tenant,
        date: { $gte: startOfDay, $lte: endOfDay },
      }).lean(),
      FeePayment.aggregate([
        {
          $match: {
            tenant: new mongoose.Types.ObjectId(tenant),
            paidAt: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $group: { _id: null, total: { $sum: '$amount' } },
        },
      ]),
      FeeChallan.aggregate([
        {
          $match: {
            tenant: new mongoose.Types.ObjectId(tenant),
            status: { $in: ['PENDING', 'PARTIAL', 'OVERDUE'] },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: { $subtract: ['$totalAmount', { $ifNull: ['$paidAmount', 0] }] } },
          },
        },
      ]),
      Student.find({ tenant, status: 'ACTIVE' })
        .populate('class', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Student.aggregate([
        { $match: { tenant: new mongoose.Types.ObjectId(tenant), status: 'ACTIVE' } },
        {
          $group: { _id: '$class', count: { $sum: 1 } },
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
    ]);

    const todayTotal = todayAttendanceRecords.length;
    const todayPresent = todayAttendanceRecords.filter((r) =>
      ['PRESENT', 'LATE', 'HALF_DAY'].includes(r.status)
    ).length;
    const todayAttendancePct = todayTotal > 0 ? Math.round((todayPresent / todayTotal) * 100) : 0;

    const monthTotal = monthlyFeeTotal.length > 0 ? monthlyFeeTotal[0].total : 0;
    const pendingTotal = pendingFeesTotal.length > 0 ? pendingFeesTotal[0].total : 0;

    res.json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        todayAttendance: {
          total: todayTotal,
          present: todayPresent,
          absent: todayTotal - todayPresent,
          percentage: todayAttendancePct,
        },
        monthlyFeeCollected: monthTotal,
        pendingFeesTotal: pendingTotal,
        recentStudents,
        classWiseStudentCount: classWiseStudents,
        monthlyFeeTrend: monthlyFeeTrend,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTeacherDashboard = async (req, res) => {
  try {
    const tenant = req.tenant._id;

    const teacher = await Teacher.findOne({ tenant, user: req.user._id });
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    const classIds = teacher.assignedClasses
      ? teacher.assignedClasses.map((a) => a.class)
      : [];

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayName = DAYS[new Date().getDay()];

    const [
      myClassesCount,
      totalStudents,
      todayAttendanceMarked,
      pendingHomeworkSubmissions,
      todayTimetable,
    ] = await Promise.all([
      Promise.resolve(classIds.length),
      classIds.length > 0
        ? Student.countDocuments({ tenant, class: { $in: classIds }, status: 'ACTIVE' })
        : 0,
      classIds.length > 0
        ? Attendance.countDocuments({
            tenant,
            class: { $in: classIds },
            date: { $gte: startOfDay, $lte: endOfDay },
          })
        : 0,
      (async () => {
        const homeworks = await Homework.find({
          tenant,
          teacher: req.user._id,
        }).select('_id');

        const homeworkIds = homeworks.map((h) => h._id);

        if (homeworkIds.length === 0) return 0;

        const submitted = await HomeworkSubmission.countDocuments({
          homework: { $in: homeworkIds },
          status: 'SUBMITTED',
        });

        const totalStudentsInClasses = classIds.length > 0
          ? await Student.countDocuments({ tenant, class: { $in: classIds }, status: 'ACTIVE' })
          : 0;

        const totalExpected = homeworks.length * totalStudentsInClasses;
        return totalExpected - submitted > 0 ? totalExpected - submitted : 0;
      })(),
      Timetable.find({
        tenant,
        class: { $in: classIds },
        dayOfWeek: todayName,
      })
        .populate('subject', 'name')
        .populate('class', 'name')
        .sort({ startTime: 1 })
        .lean(),
    ]);

    const totalStudentsInClasses = classIds.length > 0
      ? await Student.countDocuments({ tenant, class: { $in: classIds }, status: 'ACTIVE' })
      : 0;

    const classesPendingAttendance = totalStudentsInClasses - todayAttendanceMarked;

    res.json({
      success: true,
      data: {
        myClassesCount,
        totalStudentsInMyClasses: totalStudents,
        todayAttendancePending: classesPendingAttendance > 0 ? classesPendingAttendance : 0,
        pendingHomeworkSubmissions,
        todayTimetable,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentDashboard = async (req, res) => {
  try {
    const tenant = req.tenant._id;

    const student = await Student.findOne({ tenant, user: req.user._id }).populate('class');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayName = DAYS[new Date().getDay()];

    const [
      attendanceRecords,
      pendingFeeTotal,
      pendingHomework,
      todayTimetable,
    ] = await Promise.all([
      Attendance.find({ tenant, student: student._id }).lean(),
      FeeChallan.aggregate([
        {
          $match: {
            tenant: new mongoose.Types.ObjectId(tenant),
            student: student._id,
            status: { $in: ['PENDING', 'PARTIAL', 'OVERDUE'] },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: { $subtract: ['$totalAmount', { $ifNull: ['$paidAmount', 0] }] } },
          },
        },
      ]),
      (async () => {
        if (!student.class) return 0;

        const homeworks = await Homework.find({
          tenant,
          class: student.class._id || student.class,
        }).select('_id');

        const homeworkIds = homeworks.map((h) => h._id);

        if (homeworkIds.length === 0) return 0;

        const submissions = await HomeworkSubmission.find({
          homework: { $in: homeworkIds },
          student: student._id,
        }).select('homework');

        return homeworks.length - submissions.length;
      })(),
      student.class
        ? Timetable.find({
            tenant,
            class: student.class._id || student.class,
            dayOfWeek: todayName,
          })
            .populate('subject', 'name')
            .populate({
              path: 'teacher',
              select: 'qualification specialization',
              populate: { path: 'user', select: 'name' },
            })
            .sort({ startTime: 1 })
            .lean()
        : [],
    ]);

    const totalAttendance = attendanceRecords.length;
    const presentDays = attendanceRecords.filter((r) =>
      ['PRESENT', 'LATE', 'HALF_DAY'].includes(r.status)
    ).length;
    const attendancePct = totalAttendance > 0 ? Math.round((presentDays / totalAttendance) * 100) : 0;

    const pendingFees = pendingFeeTotal.length > 0 ? pendingFeeTotal[0].total : 0;

    res.json({
      success: true,
      data: {
        attendancePercentage: attendancePct,
        pendingFees,
        pendingHomework,
        todayTimetable,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getParentDashboard = async (req, res) => {
  try {
    const tenant = req.tenant._id;

    const children = await Student.find({
      tenant,
      'parents.parent': req.user._id,
    }).populate('class').lean();

    if (children.length === 0) {
      return res.json({ success: true, data: { children: [] } });
    }

    const childrenData = await Promise.all(
      children.map(async (child) => {
        const [attendanceRecords, pendingFeeData, pendingHomeworkCount] = await Promise.all([
          Attendance.find({ tenant, student: child._id }).lean(),
          FeeChallan.aggregate([
            {
              $match: {
                tenant: new mongoose.Types.ObjectId(tenant),
                student: child._id,
                status: { $in: ['PENDING', 'PARTIAL', 'OVERDUE'] },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: { $subtract: ['$totalAmount', { $ifNull: ['$paidAmount', 0] }] } },
              },
            },
          ]),
          (async () => {
            if (!child.class) return 0;

            const classId = child.class._id || child.class;

            const homeworks = await Homework.find({
              tenant,
              class: classId,
            }).select('_id');

            const homeworkIds = homeworks.map((h) => h._id);

            if (homeworkIds.length === 0) return 0;

            const submissions = await HomeworkSubmission.find({
              homework: { $in: homeworkIds },
              student: child._id,
            }).select('homework');

            return homeworks.length - submissions.length;
          })(),
        ]);

        const total = attendanceRecords.length;
        const present = attendanceRecords.filter((r) =>
          ['PRESENT', 'LATE', 'HALF_DAY'].includes(r.status)
        ).length;
        const attendancePct = total > 0 ? Math.round((present / total) * 100) : 0;

        const pendingFees = pendingFeeData.length > 0 ? pendingFeeData[0].total : 0;

        return {
          studentId: child._id,
          name: `${child.firstName} ${child.lastName}`,
          registrationNo: child.registrationNo,
          className: child.class ? child.class.name : '',
          attendancePercentage: attendancePct,
          pendingFees,
          pendingHomework: pendingHomeworkCount,
        };
      })
    );

    res.json({ success: true, data: { children: childrenData } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
