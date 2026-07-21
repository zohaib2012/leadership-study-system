const mongoose = require('mongoose');

const salarySlipSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  month: { type: String, required: true },
  basicSalary: { type: Number, required: true },
  deductions: { type: Number, default: 0 },
  bonuses: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'PAID'], default: 'PENDING' },
  paidAt: { type: Date },
  slipNo: { type: String, required: true, unique: true },
  remark: { type: String },
  createdAt: { type: Date, default: Date.now },
});

salarySlipSchema.index({ teacher: 1, month: 1 });

module.exports = mongoose.model('SalarySlip', salarySlipSchema);
