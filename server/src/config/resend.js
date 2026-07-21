const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const sendEmail = async ({ to, subject, html }) => {
  if (!resend) {
    console.log('Email Mock:', { to, subject });
    return { id: 'mock-email', status: 'sent' };
  }
  return resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

module.exports = { resend, sendEmail };
