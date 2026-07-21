const { sendSMS } = require('../config/twilio');
const SmsLog = require('../models/SmsLog');

const smsService = {
  sendSingle: async ({ tenantId, phone, message, template, userId }) => {
    try {
      const result = await sendSMS(phone, message);
      await SmsLog.create({
        tenant: tenantId,
        phone,
        message,
        template,
        status: 'SENT',
        sentBy: userId,
      });
      return { success: true, sid: result.sid };
    } catch (error) {
      await SmsLog.create({
        tenant: tenantId,
        phone,
        message,
        template,
        status: 'FAILED',
        sentBy: userId,
      });
      return { success: false, error: error.message };
    }
  },

  sendBulk: async ({ tenantId, recipients, message, template, userId }) => {
    const results = [];
    for (const recipient of recipients) {
      const result = await smsService.sendSingle({
        tenantId,
        phone: recipient.phone,
        message: message.replace('{name}', recipient.name || ''),
        template,
        userId,
      });
      results.push({ ...recipient, ...result });
    }
    return results;
  },
};

module.exports = smsService;
