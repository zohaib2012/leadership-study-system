const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  registrationNo: { type: String, required: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], required: true },
  fatherName: { type: String, required: true, trim: true },
  fatherCnic: { type: String },
  fatherPhone: { type: String, required: true },
  fatherEmail: { type: String },
  fatherOccupation: { type: String },
  motherName: { type: String },
  motherPhone: { type: String },
  address: { type: String, required: true },
  city: { type: String },
  previousSchool: { type: String },
  medicalNotes: { type: String },
  bFormNo: { type: String },
  bloodGroup: { type: String },
  photo: { type: String },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'PASSED_OUT', 'TRANSFERRED'], default: 'ACTIVE' },
  type: { type: String, enum: ['SCHOOL', 'ACADEMY'] },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  academySeries: { type: String, enum: ['MAY_JUNE', 'OCT_NOV'] },
  parents: [{
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    relationship: { type: String, enum: ['FATHER', 'MOTHER', 'GUARDIAN'] },
  }],
  documents: [{
    name: String,
    type: { type: String },
    fileUrl: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
  joiningDate: { type: Date, default: Date.now },
  leavingDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

studentSchema.index({ tenant: 1, registrationNo: 1 }, { unique: true });
studentSchema.index({ tenant: 1, class: 1 });
studentSchema.index({ tenant: 1, status: 1 });

studentSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Student', studentSchema);
