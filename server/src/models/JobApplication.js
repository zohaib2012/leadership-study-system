const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  academyType: { type: String, enum: ['SCHOOL', 'ACADEMY'], default: 'SCHOOL' },
  position: { type: String, required: true, trim: true },
  qualification: { type: String, trim: true },
  experience: { type: String, trim: true },
  coverLetter: { type: String, trim: true },
  status: { type: String, enum: ['NEW', 'SHORTLISTED', 'REJECTED', 'HIRED'], default: 'NEW' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

jobApplicationSchema.index({ tenant: 1, status: 1 });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
