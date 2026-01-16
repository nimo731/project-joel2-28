const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const checkUser = async () => {
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
        const user = await User.findOne({ email: email });

        if (user) {
            console.log(`User found: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log(`ID: ${user._id}`);
            // Check if password match 'password123' manually if possible or just reset it
            // We can't decrypt bcrypt, so we usually just verify existence.
        } else {
            console.log(`User ${email} NOT found.`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error checking user:', error);
        process.exit(1);
    }
};

checkUser();
