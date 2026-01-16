const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const updateCredentials = async () => {
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

        // 1. Update Admin
        const adminEmail = 'admin@joel228.com';
        const adminPw = 'Joel228@Admin2025';
        const admin = await User.findOne({ email: adminEmail });

        if (admin) {
            admin.password = adminPw;
            admin.adminPassword = adminPw;
            await admin.save();
            console.log(`[SUCCESS] Admin password updated for ${adminEmail}`);
        } else {
            console.error(`[ERROR] Admin user ${adminEmail} not found!`);
        }

        // 2. Update Member
        const memberEmail = 'patiencekaranjah@gmail.com';
        const memberPw = 'makeit&shineo6';
        const member = await User.findOne({ email: memberEmail });

        if (member) {
            member.password = memberPw;
            await member.save();
            console.log(`[SUCCESS] Member password updated for ${memberEmail}`);
        } else {
            console.error(`[ERROR] Member user ${memberEmail} not found!`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error updating credentials:', error);
        process.exit(1);
    }
};

updateCredentials();
