const mongoose = require('mongoose');

const feeChallanSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  challanNo: { type: String, required: true, unique: true },
  month: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED'], default: 'PENDING' },
  lateFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  issuedAt: { type: Date, default: Date.now },
  paidAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

feeChallanSchema.index({ tenant: 1, student: 1 });
feeChallanSchema.index({ tenant: 1, status: 1 });
feeChallanSchema.index({ tenant: 1, month: 1 });

module.exports = mongoose.model('FeeChallan', feeChallanSchema);
