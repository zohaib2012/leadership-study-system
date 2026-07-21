const twilio = require('twilio');

const client = process.env.TWILIO_ACCOUNT_SID
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const sendSMS = async (to, message) => {
  if (!client) {
    console.log('SMS Mock:', { to, message });
    return { sid: 'mock', status: 'sent' };
  }
  return client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
  });
};

module.exports = { client, sendSMS };
