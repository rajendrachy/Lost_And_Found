const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sajhakhoj';

const BADGE_TIERS = [
    { threshold: 1, type: 'bronze', name: 'First Find', description: 'Resolved your first item!' },
    { threshold: 5, type: 'bronze', name: 'Rising Hero', description: 'Resolved 5 items' },
    { threshold: 10, type: 'silver', name: 'Community Helper', description: 'Resolved 10 items' },
];

const awardBadges = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected');
        
        // Find user by email
        const user = await User.findOne({ email: 'user@gmail.com' });
        
        if (!user) {
            console.log('User not found');
            process.exit(1);
        }
        
        console.log(`Found user: ${user.name} with ${user.totalResolved} resolved`);
        
        // Initialize badges array
        if (!user.badges) {
            user.badges = [];
        }
        
        // Get current badges
        const currentBadges = user.badges.map(b => b.type + b.threshold);
        let awardedCount = 0;
        
        // Check each tier
        for (const badge of BADGE_TIERS) {
            const badgeKey = badge.type + badge.threshold;
            if (user.totalResolved >= badge.threshold && !currentBadges.includes(badgeKey)) {
                user.badges.push({
                    type: badge.type,
                    name: badge.name,
                    description: badge.description,
                    earnedAt: new Date()
                });
                console.log(`Awarded: ${badge.name} (${badge.type})`);
                awardedCount++;
            }
        }
        
        await user.save();
        
        console.log(`\nTotal badges: ${user.badges.length}`);
        user.badges.forEach(b => console.log(`- ${b.name}: ${b.type}`));
        
        await mongoose.disconnect();
        console.log('\nDone! ' + awardedCount + ' badges awarded.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

awardBadges();