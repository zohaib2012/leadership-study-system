const mongoose = require('mongoose');

const teacherAttendanceSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['PRESENT', 'ABSENT', 'LATE', 'LEAVE', 'HALF_DAY'], required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  remark: { type: String },
  createdAt: { type: Date, default: Date.now },
});

teacherAttendanceSchema.index({ teacher: 1, date: 1 }, { unique: true });
teacherAttendanceSchema.index({ tenant: 1, date: 1 });

module.exports = mongoose.model('TeacherAttendance', teacherAttendanceSchema);
