const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load environment variables from the backend/.env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// If MONGODB_URI is not set, use a default local MongoDB URI
if (!process.env.MONGODB_URI) {
    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/joel228generation';
    console.log('Using default MongoDB URI:', process.env.MONGODB_URI);
}

// Admin emails and passwords
const ADMINS = [
    {
        email: 'patiencekaranjah@gmail.com',
        adminPassword: 'Joel228@Admin2025' // Strong password
    },
    {
        email: 'jameskinyanjui@gmail.com',
        adminPassword: 'Joel228@Admin2025' // Strong password
    },
    {
        email: 'stevecalit@gmail.com',
        adminPassword: 'Joel228@Admin2025' // Strong password
    }
];

const setupAdmins = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Process each admin
        for (const admin of ADMINS) {
            // Find the user by email
            let user = await User.findOne({ email: admin.email });
            
            if (!user) {
                console.log(`Creating new admin user: ${admin.email}`);
                // Hash the admin password
                const salt = await bcrypt.genSalt(12);
                const hashedPassword = await bcrypt.hash(admin.adminPassword, salt);
                
                // Create new admin user
                user = new User({
                    name: admin.email.split('@')[0], // Use email prefix as name
                    email: admin.email,
                    password: hashedPassword, // Using the same password for both regular and admin access for simplicity
                    adminPassword: hashedPassword,
                    role: 'admin',
                    isActive: true,
                    adminPasswordChangedAt: Date.now()
                });
                
                await user.save({ validateBeforeSave: false });
                console.log(`Created admin user: ${admin.email}`);
            } else {
                // Update existing admin user's password and ensure admin role
                console.log(`Updating admin user: ${admin.email}`);
                const salt = await bcrypt.genSalt(12);
                const hashedPassword = await bcrypt.hash(admin.adminPassword, salt);
                
                // Log the hashed password for debugging
                console.log(`New hashed password for ${admin.email}:`, hashedPassword);
                
                // Update user with admin role and new password
                user.password = hashedPassword;
                user.adminPassword = hashedPassword;
                user.role = 'admin';
                user.isActive = true;
                user.adminPasswordChangedAt = Date.now();
                
                // Force save even if validation fails
                await user.save({ validateBeforeSave: false });
                console.log(`Updated admin user: ${admin.email}`);
                
                // Verify the update
                const updatedUser = await User.findById(user._id).select('+adminPassword');
                console.log('Updated user data:', {
                    email: updatedUser.email,
                    hasAdminPassword: !!updatedUser.adminPassword,
                    role: updatedUser.role
                });

                // Check if password needs to be updated
                const isPasswordValid = user.adminPassword && await bcrypt.compare(admin.adminPassword, user.adminPassword);
                if (!isPasswordValid) {
                    console.log(`Updating admin password for: ${admin.email}`);
                    const salt = await bcrypt.genSalt(12);
                    user.adminPassword = await bcrypt.hash(admin.adminPassword, salt);
                    user.adminPasswordChangedAt = Date.now();
                    await user.save({ validateBeforeSave: false });
                    console.log(`Updated admin user: ${admin.email}`);
                } else {
                    console.log(`Admin user ${admin.email} is already up to date`);
                }
            }
        }
        
        console.log('Admin setup completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error setting up admins:', error);
        process.exit(1);
    }
};

// Run the setup
setupAdmins();
