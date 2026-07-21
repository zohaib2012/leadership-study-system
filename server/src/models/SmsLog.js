const mongoose = require('mongoose');

const smsLogSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  recipient: { type: String },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  template: { type: String },
  status: { type: String, enum: ['PENDING', 'SENT', 'FAILED', 'DELIVERED'], default: 'PENDING' },
  cost: { type: Number, default: 0 },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sentAt: { type: Date, default: Date.now },
});

smsLogSchema.index({ tenant: 1, sentAt: -1 });

module.exports = mongoose.model('SmsLog', smsLogSchema);
