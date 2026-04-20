const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function testUpload() {
    try {
        console.log('Testing Cloudinary upload...');
        const result = await cloudinary.uploader.upload('https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', {
            folder: 'test'
        });
        console.log('✅ Upload successful:', result.secure_url);
    } catch (err) {
        console.error('❌ Upload failed:', err.message);
        console.error('Full Error:', err);
    }
}

testUpload();
