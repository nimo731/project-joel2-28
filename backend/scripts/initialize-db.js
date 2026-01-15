const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/User');
const Sermon = require('../models/Sermon');
const Event = require('../models/Event');
const PrayerRequest = require('../models/PrayerRequest');
const Testimony = require('../models/Testimony');
const Message = require('../models/Message');

const initializeDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI not found in .env');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('🔥 Connected to MongoDB for initialization...');

        // 1. Drop all collections to start fresh
        const collections = ['users', 'sermons', 'events', 'prayerrequests', 'testimonies', 'messages'];
        for (const collectionName of collections) {
            try {
                await mongoose.connection.db.dropCollection(collectionName);
                console.log(`✅ Dropped collection: ${collectionName}`);
            } catch (err) {
                if (err.code === 26) {
                    console.log(`ℹ️ Collection ${collectionName} does not exist, skipping drop.`);
                } else {
                    console.error(`❌ Error dropping collection ${collectionName}:`, err.message);
                }
            }
        }

        // 2. Create Default Admin User
        const adminEmail = 'admin@joel228.com';
        const adminPassword = 'admin123';

        const salt = await bcrypt.genSalt(12);
        const hashedAdminPassword = await bcrypt.hash(adminPassword, salt);

        const adminUser = new User({
            name: 'Church Admin',
            email: adminEmail,
            password: adminPassword, // Hashed by pre-save hook in model
            adminPassword: hashedAdminPassword, // Manual because it's a special field
            role: 'admin',
            isActive: true,
            joinedDate: new Date()
        });

        await adminUser.save();
        console.log(`🚀 Default Admin created: ${adminEmail} / ${adminPassword}`);

        // 3. Create Default Member User (for testing)
        const memberEmail = 'testuser@example.com';
        const memberPassword = 'password123';

        const memberUser = new User({
            name: 'Test Member',
            email: memberEmail,
            password: memberPassword,
            role: 'member',
            isActive: true,
            joinedDate: new Date()
        });

        await memberUser.save();
        console.log(`👥 Default Member created: ${memberEmail} / ${memberPassword}`);

        console.log('\n✨ Database initialized with ZERO content data.');
        console.log('📈 Dashboard will start empty as requested.');

        process.exit(0);
    } catch (err) {
        console.error('❌ Database initialization failed:', err);
        process.exit(1);
    }
};

initializeDB();
