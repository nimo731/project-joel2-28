require('dotenv').config();

module.exports = {
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    from: process.env.EMAIL_FROM || 'noreply@joel228generation.org',
    enabled: process.env.EMAIL_NOTIFICATIONS_ENABLED === 'true'
  },
  sms: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_PHONE_NUMBER,
    enabled: process.env.SMS_NOTIFICATIONS_ENABLED === 'true'
  },
  app: {
    name: 'Joel 2:28 Generation',
    url: process.env.APP_URL || 'http://localhost:3000',
    supportEmail: process.env.SUPPORT_EMAIL || 'support@joel228generation.org'
  }
};
