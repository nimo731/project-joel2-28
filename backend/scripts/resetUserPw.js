const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const resetPw = async () => {
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
        const newPassword = 'password123';
        const user = await User.findOne({ email: email });

        if (!user) {
            console.error('User not found!');
            process.exit(1);
        }

        user.password = newPassword;
        await user.save();

        console.log(`Password for ${email} has been reset to: ${newPassword}`);
        process.exit(0);
    } catch (error) {
        console.error('Error resetting password:', error);
        process.exit(1);
    }
};

resetPw();
