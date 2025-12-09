// Simple email utility that logs to console in development
// In production, this would be replaced with a real email service like Nodemailer

const sendEmail = async (options) => {
    // In development, just log the email to console
    console.log('--- Email ---');
    console.log('To:', options.email);
    console.log('Subject:', options.subject);
    console.log('Message:', options.message);
    console.log('------------');
    
    return { success: true, message: 'Email logged to console (in development)' };
};

module.exports = sendEmail;
