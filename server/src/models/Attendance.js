const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['PRESENT', 'ABSENT', 'LATE', 'LEAVE', 'HALF_DAY'], required: true },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remark: { type: String },
  createdAt: { type: Date, default: Date.now },
});

attendanceSchema.index({ student: 1, date: 1 }, { unique: true });
attendanceSchema.index({ tenant: 1, date: 1 });
attendanceSchema.index({ tenant: 1, class: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
