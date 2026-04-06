const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkAdmins = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        const admins = await User.find({ role: 'admin' }).select('+password +adminPassword');
        console.log(`Found ${admins.length} admins.`);

        admins.forEach(admin => {
            console.log(`- Email: ${admin.email}`);
            console.log(`  Has password: ${!!admin.password}`);
            console.log(`  Has adminPassword: ${!!admin.adminPassword}`);
        });

        const specificUser = await User.findOne({ email: 'admin@joel228.com' });
        if (specificUser) {
            console.log('Found admin@joel228.com:');
            console.log(`  Role: ${specificUser.role}`);
            console.log(`  Active: ${specificUser.isActive}`);
        } else {
            console.log('admin@joel228.com NOT found in database.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

checkAdmins();
