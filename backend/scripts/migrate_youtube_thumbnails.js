const mongoose = require('mongoose');
const envConfig = require('../config/envConfig');
const Sermon = require('../models/Sermon');

const getYouTubeThumbnail = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
};

async function migrateSermonThumbnails() {
    try {
        console.log('Starting migration for YouTube sermon thumbnails...');
        envConfig.normalizeEnv();
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');

        const sermons = await Sermon.find();
        console.log(`Found ${sermons.length} total sermons.`);

        let updatedCount = 0;

        for (const sermon of sermons) {
            const hasNoThumbnail = !sermon.thumbnailUrl || sermon.thumbnailUrl === 'null' || sermon.thumbnailUrl === 'undefined';
            
            if (hasNoThumbnail) {
                console.log(`\nSermon: "${sermon.title}" is missing a thumbnail.`);
                const ytThumb = getYouTubeThumbnail(sermon.videoLink);
                
                if (ytThumb) {
                    console.log(`  -> Found YouTube video: ${sermon.videoLink}`);
                    console.log(`  -> Setting thumbnail to: ${ytThumb}`);
                    sermon.thumbnailUrl = ytThumb;
                    await sermon.save();
                    updatedCount++;
                } else {
                    console.log(`  -> Video link "${sermon.videoLink}" is not a recognized YouTube link.`);
                }
            }
        }

        console.log(`\nMigration complete. Updated ${updatedCount} sermons.`);
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

migrateSermonThumbnails();
