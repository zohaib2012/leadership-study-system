const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  qualification: { type: String },
  experience: { type: Number },
  specialization: { type: String },
  joinDate: { type: Date, default: Date.now },
  salary: { type: Number },
  contractType: { type: String, enum: ['PERMANENT', 'CONTRACT', 'VISITING'] },
  cnic: { type: String },
  address: { type: String },
  photo: { type: String },
  assignedClasses: [{
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  }],
  documents: [{
    name: String,
    type: { type: String },
    fileUrl: String,
  }],
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

teacherSchema.index({ tenant: 1, user: 1 }, { unique: true });
teacherSchema.index({ tenant: 1, status: 1 });

module.exports = mongoose.model('Teacher', teacherSchema);
