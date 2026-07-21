const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String },
  fileName: { type: String },
  dueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

homeworkSchema.index({ tenant: 1, class: 1 });
homeworkSchema.index({ teacher: 1 });

module.exports = mongoose.model('Homework', homeworkSchema);
