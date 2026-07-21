const mongoose = require('mongoose');

const tenantSubscriptionSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
  amount: { type: Number, required: true },
  invoiceNo: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

tenantSubscriptionSchema.index({ tenant: 1, status: 1 });

module.exports = mongoose.model('TenantSubscription', tenantSubscriptionSchema);
