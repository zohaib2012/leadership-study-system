const mongoose = require('mongoose');

const academicSessionSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isCurrent: { type: Boolean, default: false },
  terms: [{
    name: String,
    startDate: Date,
    endDate: Date,
  }],
  createdAt: { type: Date, default: Date.now },
});

academicSessionSchema.index({ tenant: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('AcademicSession', academicSessionSchema);
