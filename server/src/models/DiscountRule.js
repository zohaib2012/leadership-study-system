const mongoose = require('mongoose');

const discountRuleSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['SIBLING', 'MERIT', 'CUSTOM'], required: true },
  value: { type: Number, required: true },
  valueType: { type: String, enum: ['PERCENTAGE', 'FIXED'], required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

discountRuleSchema.index({ tenant: 1 });

module.exports = mongoose.model('DiscountRule', discountRuleSchema);
