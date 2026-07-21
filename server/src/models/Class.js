const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  name: { type: String, required: true, trim: true },
  numericLevel: { type: Number },
  type: { type: String, enum: ['SCHOOL', 'O_LEVEL', 'AS_LEVEL', 'A_LEVEL'], required: true },
  sortOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

classSchema.index({ tenant: 1, name: 1 }, { unique: true });
classSchema.index({ tenant: 1, type: 1 });

module.exports = mongoose.model('Class', classSchema);

const sectionSchema = new mongoose.Schema({
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  name: { type: String, required: true },
  capacity: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

sectionSchema.index({ class: 1, name: 1 }, { unique: true });

module.exports.Section = mongoose.model('Section', sectionSchema);
