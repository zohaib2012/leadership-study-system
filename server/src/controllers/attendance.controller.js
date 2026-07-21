const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const TeacherAttendance = require('../models/TeacherAttendance');
const Student = require('../models/Student');
const Class = require('../models/Class');

const markAttendance = async (req, res) => {
  try {
    const tenantId = req.tenant._id;
    const { records, date } = req.body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'records array is required' });
    }

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const bulkOps = records.map(({ studentId, classId, status, remark }) => ({
      updateOne: {
        filter: {
          tenant: tenantId,
          student: studentId,
          date: attendanceDate,
        },
        update: {
          tenant: tenantId,
          student: studentId,
          class: classId,
          date: attendanceDate,
          status,
          remark: remark || '',
          markedBy: req.user._id,
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(bulkOps);

    const saved = await Attendance.find({
      tenant: tenantId,
      date: attendanceDate,
      student: { $in: records.map((r) => new mongoose.Types.ObjectId(r.studentId)) },
    });

    res.status(200).json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDailyAttendance = async (req, res) => {
  try {
    const tenantId = req.tenant._id;
    const { classId, date } = req.query;

    if (!classId) {
      return res.status(400).json({ success: false, message: 'classId is required' });
    }

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);
    const endOfDay = new Date(attendanceDate);
    endOfDay.setHours(23, 59, 59, 999);

    const students = await Student.find({ tenant: tenantId, class: classId, status: 'ACTIVE' })
      .select('_id registrationNo firstName lastName');

    const studentIds = students.map((s) => s._id);

    const attendanceRecords = await Attendance.find({
      tenant: tenantId,
      class: classId,
      date: { $gte: attendanceDate, $lte: endOfDay },
      student: { $in: studentIds },
    });

    const attendanceMap = {};
    for (const record of attendanceRecords) {
      attendanceMap[record.student.toString()] = {
        status: record.status,
        remark: record.remark,
        markedBy: record.markedBy,
        _id: record._id,
      };
    }

    const result = students.map((student) => ({
      _id: student._id,
      registrationNo: student.registrationNo,
      firstName: student.firstName,
      lastName: student.lastName,
      attendance: attendanceMap[student._id.toString()] || null,
    }));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMonthlyReport = async (req, res) => {
  try {
    const tenantId = req.tenant._id;
    const { classId, month } = req.query;

    if (!classId || !month) {
      return res.status(400).json({ success: false, message: 'classId and month are required' });
    }

    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

    const attendanceRecords = await Attendance.find({
      tenant: tenantId,
      class: classId,
      date: { $gte: startDate, $lte: endDate },
    });

    const studentStats = {};

    for (const record of attendanceRecords) {
      const sid = record.student.toString();
      if (!studentStats[sid]) {
        studentStats[sid] = { total: 0, present: 0 };
      }
      studentStats[sid].total += 1;
      if (['PRESENT', 'LATE', 'HALF_DAY'].includes(record.status)) {
        studentStats[sid].present += 1;
      }
    }

    const studentIds = Object.keys(studentStats).map((id) => new mongoose.Types.ObjectId(id));
    const students = await Student.find({ _id: { $in: studentIds } })
      .select('_id registrationNo firstName lastName');

    const studentMap = {};
    for (const s of students) {
      studentMap[s._id.toString()] = s;
    }

    const result = Object.entries(studentStats).map(([sid, stats]) => {
      const percentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
      const student = studentMap[sid] || {};
      return {
        studentId: sid,
        registrationNo: student.registrationNo || '',
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        totalDays: stats.total,
        presentDays: stats.present,
        absentDays: stats.total - stats.present,
        percentage,
      };
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStudentAttendance = async (req, res) => {
  try {
    const tenantId = req.tenant._id;
    const studentId = req.params.id; // From route /student/:id
    const { startDate, endDate } = req.query;

    if (!studentId) {
      return res.status(400).json({ success: false, message: 'studentId is required' });
    }

    const filter = { tenant: tenantId, student: studentId };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
        filter.date.$gte.setHours(0, 0, 0, 0);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
        filter.date.$lte.setHours(23, 59, 59, 999);
      }
    }

    const records = await Attendance.find(filter)
      .sort({ date: -1 })
      .populate('class', 'name')
      .select('date status remark class');

    const data = records.map((r) => ({
      _id: r._id,
      date: r.date,
      status: r.status,
      remark: r.remark,
      class: r.class ? r.class.name : '',
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAttendanceStats = async (req, res) => {
  try {
    const tenantId = req.tenant._id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      tenant: tenantId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const total = records.length;
    const present = records.filter((r) => ['PRESENT', 'LATE', 'HALF_DAY'].includes(r.status)).length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    res.status(200).json({
      success: true,
      data: { total, present, absent, percentage },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markTeacherAttendance = async (req, res) => {
  try {
    const tenantId = req.tenant._id;
    const { records, date } = req.body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'records array is required' });
    }

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const bulkOps = records.map(({ teacherId, status, remark }) => ({
      updateOne: {
        filter: {
          tenant: tenantId,
          teacher: teacherId,
          date: attendanceDate,
        },
        update: {
          tenant: tenantId,
          teacher: teacherId,
          date: attendanceDate,
          status,
          remark: remark || '',
        },
        upsert: true,
      },
    }));

    await TeacherAttendance.bulkWrite(bulkOps);

    const saved = await TeacherAttendance.find({
      tenant: tenantId,
      date: attendanceDate,
      teacher: { $in: records.map((r) => new mongoose.Types.ObjectId(r.teacherId)) },
    });

    res.status(200).json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTeacherAttendanceReport = async (req, res) => {
  try {
    const tenantId = req.tenant._id;
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ success: false, message: 'month is required' });
    }

    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

    const records = await TeacherAttendance.find({
      tenant: tenantId,
      date: { $gte: startDate, $lte: endDate },
    }).populate('teacher', 'employeeId');

    const teacherStats = {};

    for (const record of records) {
      const tid = record.teacher ? record.teacher._id.toString() : record.teacher.toString();
      if (!teacherStats[tid]) {
        teacherStats[tid] = { total: 0, present: 0 };
      }
      teacherStats[tid].total += 1;
      if (['PRESENT', 'LATE', 'HALF_DAY'].includes(record.status)) {
        teacherStats[tid].present += 1;
      }
    }

    const teacherIds = Object.keys(teacherStats).map((id) => new mongoose.Types.ObjectId(id));
    const Teacher = require('../models/Teacher');
    const teachers = await Teacher.find({ _id: { $in: teacherIds } })
      .populate('user', 'name email');

    const teacherMap = {};
    for (const t of teachers) {
      teacherMap[t._id.toString()] = t;
    }

    const result = Object.entries(teacherStats).map(([tid, stats]) => {
      const percentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
      const teacher = teacherMap[tid] || {};
      return {
        teacherId: tid,
        name: teacher.user ? teacher.user.name : '',
        totalDays: stats.total,
        presentDays: stats.present,
        absentDays: stats.total - stats.present,
        percentage,
      };
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  markAttendance,
  getDailyAttendance,
  getMonthlyReport,
  getStudentAttendance,
  getAttendanceStats,
  markTeacherAttendance,
  getTeacherAttendanceReport,
};
