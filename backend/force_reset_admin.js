const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        // Use a shorter timeout to fail fast if blocked
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('Connected!');

        const usersToReset = [
            {
                email: 'admin@joel228.com',
                password: 'Joel228@Admin2025',
                role: 'admin',
                name: 'System Admin'
            },
            {
                email: 'patiencekaranjah@gmail.com',
                password: 'makeit&shineo6',
                role: 'member',
                name: 'Patience Karanjah'
            }
        ];

        for (const userData of usersToReset) {
            const hashedPassword = await bcrypt.hash(userData.password, 12);
            let user = await User.findOne({ email: userData.email });

            if (user) {
                console.log(`Updating user: ${userData.email}`);
                user.password = hashedPassword;
                if (userData.role === 'admin') user.adminPassword = hashedPassword;
                user.role = userData.role;
                user.isActive = true;
                await user.save({ validateBeforeSave: false });
            } else {
                console.log(`Creating user: ${userData.email}`);
                user = new User({
                    name: userData.name,
                    email: userData.email,
                    password: hashedPassword,
                    adminPassword: userData.role === 'admin' ? hashedPassword : undefined,
                    role: userData.role,
                    isActive: true
                });
                await user.save({ validateBeforeSave: false });
            }
        }

        console.log('--- USER RESET COMPLETE ---');
        console.log('1. Member: patiencekaranjah@gmail.com / makeit&shineo6');
        console.log('2. Admin: admin@joel228.com / Joel228@Admin2025');
        console.log('Please try logging in now.');

        process.exit(0);
    } catch (err) {
        console.error('FAILED TO RESET ADMIN:', err.message);
        if (err.message.includes('Server selection timed out')) {
            console.log('\n👉 TIP: Your MongoDB Atlas cluster is blocking my IP. Please whitelist 0.0.0.0/0 in Atlas so I can fix this for you!');
        }
        process.exit(1);
    }
};

resetAdmin();
