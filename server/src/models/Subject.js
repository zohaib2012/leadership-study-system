const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  name: { type: String, required: true, trim: true },
  code: { type: String, trim: true },
  type: { type: String, enum: ['SCHOOL', 'ACADEMY'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

subjectSchema.index({ tenant: 1, code: 1 }, { unique: true, sparse: true });
subjectSchema.index({ tenant: 1, name: 1 });

module.exports = mongoose.model('Subject', subjectSchema);
