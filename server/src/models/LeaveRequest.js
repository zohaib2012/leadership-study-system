const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  type: { type: String, enum: ['SICK', 'CASUAL', 'EMERGENCY', 'OTHER'], required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

leaveRequestSchema.index({ tenant: 1, status: 1 });
leaveRequestSchema.index({ user: 1 });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
