const mongoose = require('mongoose');

const homeworkSubmissionSchema = new mongoose.Schema({
  homework: { type: mongoose.Schema.Types.ObjectId, ref: 'Homework', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  fileUrl: { type: String },
  fileName: { type: String },
  textContent: { type: String },
  status: { type: String, enum: ['PENDING', 'SUBMITTED', 'LATE', 'REVIEWED'], default: 'SUBMITTED' },
  submittedAt: { type: Date, default: Date.now },
  remarks: { type: String },
  gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

homeworkSubmissionSchema.index({ homework: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('HomeworkSubmission', homeworkSubmissionSchema);
