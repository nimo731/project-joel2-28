const emailService = require('./emailService');
const smsService = require('./smsService');
const logger = require('../utils/logger');

class NotificationService {
  async sendNotification(user, notificationType, data) {
    try {
      const results = {
        email: { success: false },
        sms: { success: false }
      };

      // Send email notification if enabled and user has email notifications on
      if (user.notificationPreferences?.email && 
          user.notificationPreferences[notificationType] !== false && 
          user.email) {
        try {
          results.email = await this._sendEmailNotification(user, notificationType, data);
        } catch (error) {
          logger.error(`Email notification failed: ${error.message}`);
          results.email.error = error.message;
        }
      }

      // Send SMS notification if enabled, user has SMS notifications on, and has a phone number
      if (user.notificationPreferences?.sms && 
          user.notificationPreferences[notificationType] !== false && 
          user.phone) {
        try {
          results.sms = await this._sendSmsNotification(user, notificationType, data);
        } catch (error) {
          logger.error(`SMS notification failed: ${error.message}`);
          results.sms.error = error.message;
        }
      }

      return {
        success: results.email.success || results.sms.success,
        results
      };
    } catch (error) {
      logger.error(`Notification service error: ${error.message}`);
      throw error;
    }
  }

  async _sendEmailNotification(user, type, data) {
    switch (type) {
      case 'prayerRequestUpdates':
        return emailService.sendStatusUpdateEmail(user, data);
      // Add more notification types as needed
      default:
        throw new Error(`Unsupported notification type for email: ${type}`);
    }
  }

  async _sendSmsNotification(user, type, data) {
    switch (type) {
      case 'prayerRequestUpdates':
        return smsService.sendStatusUpdateSms(user, data);
      // Add more notification types as needed
      default:
        throw new Error(`Unsupported notification type for SMS: ${type}`);
    }
  }
}

module.exports = new NotificationService();
