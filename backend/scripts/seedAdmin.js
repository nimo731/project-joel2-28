const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
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
        const adminExists = await User.findOne({ email: adminEmail });

        if (adminExists) {
            console.log('Admin user already exists');

            // Optional: Ensure role is admin
            if (adminExists.role !== 'admin') {
                adminExists.role = 'admin';
                adminExists.adminPassword = 'admin123';
                await adminExists.save();
                console.log('Updated existing user to admin role');
            }
        } else {
            const adminUser = new User({
                name: 'Admin User',
                email: adminEmail,
                password: 'admin123',
                adminPassword: 'admin123', // Set admin password explicitly
                role: 'admin',
                isActive: true
            });

            await adminUser.save();
            console.log('Admin user created successfully');
            console.log('Email: admin@joel228.com');
            console.log('Password: admin123');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
