const StudentEnrollment = require('../models/StudentEnrollment');
const mongoose = require('mongoose');

const studentEnrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicSession', required: true },
  rollNo: { type: Number },
  enrollmentDate: { type: Date, default: Date.now },
});

studentEnrollmentSchema.index({ student: 1, session: 1 }, { unique: true });

module.exports = mongoose.model('StudentEnrollment', studentEnrollmentSchema);
