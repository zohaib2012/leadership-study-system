const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  target: { type: String, enum: ['ALL', 'TEACHERS', 'STUDENTS', 'CLASS', 'PARENTS'], default: 'ALL' },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  isPinned: { type: Boolean, default: false },
  expiresAt: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

announcementSchema.index({ tenant: 1, createdAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);
