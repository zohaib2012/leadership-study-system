const { sendEmail } = require('../config/resend');

const emailService = {
  sendWelcome: async (email, name, tenantName) => {
    return sendEmail({
      to: email,
      subject: `Welcome to ${tenantName} - Leadership Study System`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome, ${name}!</h2>
          <p>Your account has been created at <strong>${tenantName}</strong>.</p>
          <p>You can now log in to your portal to access all features.</p>
          <a href="${process.env.CLIENT_URL}/login" style="display: inline-block; padding: 10px 20px; background: #1e3a5f; color: white; text-decoration: none; border-radius: 5px;">Login Now</a>
        </div>
      `,
    });
  },

  sendFeeReceipt: async (email, studentName, receiptData) => {
    return sendEmail({
      to: email,
      subject: `Fee Receipt - ${studentName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Fee Payment Receipt</h2>
          <p>Student: <strong>${studentName}</strong></p>
          <p>Amount: <strong>Rs. ${receiptData.amount}</strong></p>
          <p>Receipt No: <strong>${receiptData.receiptNo}</strong></p>
          <p>Date: <strong>${new Date(receiptData.paidAt).toLocaleDateString()}</strong></p>
        </div>
      `,
    });
  },

  sendPasswordReset: async (email, resetUrl) => {
    return sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background: #1e3a5f; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>This link expires in 1 hour.</p>
        </div>
      `,
    });
  },

  sendCustom: async (email, subject, html) => {
    return sendEmail({ to: email, subject, html });
  },
};

module.exports = emailService;
