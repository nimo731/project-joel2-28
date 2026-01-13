const twilio = require('twilio');
const config = require('../config/notifications');
const logger = require('../utils/logger');

class SmsService {
  constructor() {
    if (config.sms.enabled) {
      this.client = twilio(config.sms.accountSid, config.sms.authToken);
    }
  }

  async sendSms(to, message) {
    if (!config.sms.enabled) {
      logger.info(`SMS notifications are disabled. Would have sent to ${to}: ${message}`);
      return { success: true, message: 'SMS notifications are disabled' };
    }

    try {
      const response = await this.client.messages.create({
        body: message,
        from: config.sms.fromNumber,
        to: `+${to.replace(/\D/g, '')}` // Clean and format the phone number
      });

      logger.info(`SMS sent: ${response.sid}`);
      return { success: true, sid: response.sid };
    } catch (error) {
      logger.error('Error sending SMS:', error);
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  async sendStatusUpdateSms(user, statusUpdate) {
    const message = `${config.app.name}: Hi ${user.name || 'there'}, your prayer request status has been updated to: ${statusUpdate.status}. ${statusUpdate.notes ? `Notes: ${statusUpdate.notes}` : ''} Login for details.`;
    return this.sendSms(user.phone, message);
  }
}

module.exports = new SmsService();
