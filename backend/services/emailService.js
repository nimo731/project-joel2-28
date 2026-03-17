const nodemailer = require('nodemailer');
const config = require('../config/notifications');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    if (config.email.enabled) {
      console.log(`Email service enabled. Using host: ${config.email.host}, port: ${config.email.port}, user: ${config.email.auth.user}`);
      const isGmail = config.email.host.includes('gmail.com');

      const transportConfig = isGmail ? {
        service: 'gmail',
        auth: {
          user: config.email.auth.user,
          pass: config.email.auth.pass
        }
      } : {
        host: config.email.host,
        port: config.email.port,
        secure: config.email.port === 465, // true for 465, false for other ports
        auth: {
          user: config.email.auth.user,
          pass: config.email.auth.pass
        }
      };

      this.transporter = nodemailer.createTransport(transportConfig);
    } else {
      console.log('Email service is DISABLED');
    }
  }

  async sendEmail(to, subject, html) {
    if (!config.email.enabled) {
      console.log(`Email notifications are disabled. Would have sent to ${to}: ${subject}`);
      logger.info(`Email notifications are disabled. Would have sent to ${to}: ${subject}`);
      return { success: true, message: 'Email notifications are disabled' };
    }

    console.log(`Attempting to send email to ${to} with subject: ${subject}`);

    try {
      const mailOptions = {
        from: `"${config.app.name}" <${config.email.from}>`,
        to,
        subject,
        html
      };

      console.log('--- ATTEMPTING TO SEND EMAIL ---');
      console.log(`From: "${config.app.name}" <${config.email.from}>`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);

      const info = await this.transporter.sendMail(mailOptions);
      console.log('--- EMAIL SENT SUCCESSFULLY ---');
      console.log(`MessageId: ${info.messageId}`);
      console.log(`Response: ${info.response}`);
      logger.info(`Email sent: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('--- EMAIL SENDING FAILED ---');
      console.error('Error Details:', error);
      logger.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendStatusUpdateEmail(user, statusUpdate) {
    const subject = `Your Prayer Request Status Has Been Updated`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Prayer Request Update</h2>
        <p>Hello ${user.name || 'there'},</p>
        <p>The status of your prayer request has been updated to: <strong>${statusUpdate.status}</strong></p>
        ${statusUpdate.notes ? `<p><strong>Notes:</strong> ${statusUpdate.notes}</p>` : ''}
        <p>You can view more details by logging into your account.</p>
        <p>If you have any questions, please contact our support team at ${config.app.supportEmail}.</p>
        <p>Blessings,<br>The ${config.app.name} Team</p>
      </div>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${config.app.url}/reset-password/${resetToken}`;
    const subject = `Password Reset Request - ${config.app.name}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
        <p>Hello ${user.name || 'there'},</p>
        <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the button below to complete the process:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p>This link will expire in 1 hour.</p>
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777;">If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
        <p style="font-size: 12px; color: #777; word-break: break-all;">${resetUrl}</p>
        <p>Blessings,<br>The ${config.app.name} Team</p>
      </div>
    `;

    return this.sendEmail(user.email, subject, html);
  }
}

module.exports = new EmailService();
