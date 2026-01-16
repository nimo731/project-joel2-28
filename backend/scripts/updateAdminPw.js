const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const updateAdminPw = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error('MONGODB_URI is not defined in .env');
            process.exit(1);
        }

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB...');

        const adminEmail = 'admin@joel228.com';
        const newPassword = 'Joel228@Admin2025';
        const adminUser = await User.findOne({ email: adminEmail });

        if (!adminUser) {
            console.error('Admin user not found!');
            process.exit(1);
        }

        // Update password
        // Mongoose middleware should handle hashing if set directly on password field?
        // User.js model usually has pre-save hook. Let's assume it does.
        // But for adminPassword (plain text field often used in simple setups or legacy), we update that too if it exists.

        adminUser.password = newPassword;
        if (adminUser.adminPassword) {
            adminUser.adminPassword = newPassword;
        }

        await adminUser.save();
        console.log(`Admin password updated successfully for ${adminEmail}`);

        process.exit(0);
    } catch (error) {
        console.error('Error updating admin password:', error);
        process.exit(1);
    }
};

updateAdminPw();
