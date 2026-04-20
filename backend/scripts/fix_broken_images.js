const mongoose = require('mongoose');
const path = require('path');
const envConfig = require('../config/envConfig');
const { cloudinary } = require('../config/cloudinary');
const Event = require('../models/Event');

async function fixBrokenImages() {
    try {
        console.log('--- Migration Script Started ---');
        envConfig.normalizeEnv();

        console.log('Cloudinary Config Check:');
        console.log(`- Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
        console.log(`- API Key: ${process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing'}`);
        console.log(`- API Secret: ${process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing'}`);

        // Re-configure cloudinary just in case
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected successfully to MongoDB.');

        // Find events with Facebook CDN URLs
        const events = await Event.find({
            $or: [
                { imageUrl: { $regex: 'fbcdn.net' } },
                { imageUrl: { $regex: 'facebook.com' } }
            ]
        });

        console.log(`Found ${events.length} events with potentially broken external URLs.`);

        for (const event of events) {
            console.log(`\nProcessing event: "${event.title}"`);
            console.log(`Old URL: ${event.imageUrl}`);

            try {
                const result = await cloudinary.uploader.upload(event.imageUrl, {
                    folder: 'joel228/events',
                    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
                });

                console.log(`✅ Successfully uploaded to Cloudinary: ${result.secure_url}`);

                event.imageUrl = result.secure_url;
                await event.save();

                console.log(`✨ Updated event in database.`);
            } catch (err) {
                console.error(`❌ Failed to process image:`, err.message);
            }
        }

        console.log('\n--- Migration Complete ---');
    } catch (err) {
        console.error('CRITICAL ERROR during migration:', err);
    } finally {
        await mongoose.disconnect();
    }
}

fixBrokenImages();
