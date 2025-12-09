const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/joel228generation', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Import User model
const User = require('../models/User');

// Check admin user
async function checkAdmin() {
    try {
        const admin = await User.findOne({ email: 'patiencekaranjah@gmail.com' });
        if (!admin) {
            console.log('Admin user not found');
            return;
        }
        
        console.log('Admin user found:');
        console.log({
            email: admin.email,
            role: admin.role,
            isActive: admin.isActive,
            hasPassword: !!admin.password,
            hasAdminPassword: !!admin.adminPassword,
            lastLogin: admin.lastLogin,
            lastAdminLogin: admin.lastAdminLogin,
            createdAt: admin.createdAt
        });
        
    } catch (error) {
        console.error('Error checking admin user:', error);
    } finally {
        mongoose.connection.close();
    }
}

checkAdmin();
