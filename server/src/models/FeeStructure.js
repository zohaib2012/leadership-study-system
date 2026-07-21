const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  batchType: { type: String, enum: ['SCHOOL', 'O_LEVEL', 'AS_LEVEL', 'A_LEVEL'] },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  frequency: { type: String, enum: ['ONE_TIME', 'MONTHLY', 'QUARTERLY', 'YEARLY'], required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

feeStructureSchema.index({ tenant: 1, class: 1 });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
