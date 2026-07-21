const mongoose = require('mongoose');

const feePaymentSchema = new mongoose.Schema({
  challan: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeChallan', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['CASH', 'BANK_TRANSFER', 'JAZZCASH', 'EASYPAISA', 'CHEQUE'], required: true },
  reference: { type: String },
  receiptNo: { type: String, required: true, unique: true },
  receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remark: { type: String },
  paidAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

feePaymentSchema.index({ student: 1 });
feePaymentSchema.index({ challan: 1 });
feePaymentSchema.index({ tenant: 1, paidAt: -1 });

module.exports = mongoose.model('FeePayment', feePaymentSchema);
