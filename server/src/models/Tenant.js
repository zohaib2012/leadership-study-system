const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  subdomain: { type: String, required: true, unique: true, lowercase: true, trim: true },
  logo: { type: String },
  address: { type: String },
  city: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  type: { type: String, enum: ['SCHOOL', 'ACADEMY', 'BOTH'], default: 'BOTH' },
  status: { type: String, enum: ['TRIAL', 'ACTIVE', 'SUSPENDED', 'EXPIRED'], default: 'TRIAL' },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan' },
  trialEndsAt: { type: Date },
  socialLinks: {
    facebook: String,
    instagram: String,
    youtube: String,
    pinterest: String,
    whatsapp: String,
  },
  settings: {
    smsProvider: String,
    smsApiKey: String,
    smsSenderId: String,
    emailProvider: String,
    gradingSystem: mongoose.Schema.Types.Mixed,
    themeColor: { type: String, default: '#1e3a5f' },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

tenantSchema.index({ status: 1 });

module.exports = mongoose.model('Tenant', tenantSchema);
