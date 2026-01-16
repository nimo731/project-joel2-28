const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const verifyLogin = async () => {
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

        const email = 'patiencekaranjah@gmail.com';
        const candidatePassword = 'makeit&shineo6';

        const user = await User.findOne({ email }).select('+password'); // Only need password for member

        if (!user) {
            console.error('User not found');
            process.exit(1);
        }

        console.log(`Checking user: ${email} (Role: ${user.role})`);

        const isMatch = await user.comparePassword(candidatePassword);
        const isAdminMatch = await user.compareAdminPassword(candidatePassword);

        if (isMatch) {
            console.log('LOGIN SUCCESS: Password matches hash.');
        } else {
            console.error('LOGIN FAILED: Password does NOT match hash.');
        }

        if (isAdminMatch) {
            console.log('LOGIN SUCCESS: Admin Password matches hash.');
        } else {
            console.error('LOGIN FAILED: Admin Password does NOT match hash.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error verification:', error);
        process.exit(1);
    }
};

verifyLogin();
