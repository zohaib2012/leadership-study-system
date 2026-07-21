const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  key: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now },
});

settingSchema.index({ tenant: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('Setting', settingSchema);
