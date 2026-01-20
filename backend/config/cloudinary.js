const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('./envConfig'); // Ensure normalization happened

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create storage instances for different upload types
const createCloudinaryStorage = (folder) => {
    // Re-verify config just in case env vars loaded late
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_APT_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_APT_SECRET
    });

    return new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: `joel228/${folder}`,
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
        }
    });
};

module.exports = {
    cloudinary,
    createCloudinaryStorage
};
