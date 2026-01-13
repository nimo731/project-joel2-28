const nodemailer = require('nodemailer');
const config = require('../config/notifications');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    if (config.email.enabled) {
      this.transporter = nodemailer.createTransport({
        service: config.email.service,
        auth: {
          user: config.email.auth.user,
          pass: config.email.auth.pass
        }
      });
    }
  }

  async sendEmail(to, subject, html) {
    if (!config.email.enabled) {
      logger.info(`Email notifications are disabled. Would have sent to ${to}: ${subject}`);
      return { success: true, message: 'Email notifications are disabled' };
    }

    try {
      const mailOptions = {
        from: `"${config.app.name}" <${config.email.from}>`,
        to,
        subject,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
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
}

module.exports = new EmailService();
