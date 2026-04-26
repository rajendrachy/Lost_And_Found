const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

async function cleanupBadges() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const users = await User.find({});
        console.log(`Found ${users.length} users`);

        let fixedCount = 0;

        for (const user of users) {
            if (user.badges && user.badges.length > 0) {
                const uniqueBadges = [];
                const seenNames = new Set();

                for (const badge of user.badges) {
                    if (!seenNames.has(badge.name)) {
                        uniqueBadges.push(badge);
                        seenNames.add(badge.name);
                    } else {
                        console.log(`Removing duplicate: ${badge.name} from user ${user.name}`);
                    }
                }

                if (uniqueBadges.length !== user.badges.length) {
                    user.badges = uniqueBadges;
                    await user.save();
                    fixedCount++;
                }
            }
        }

        console.log(`\nFixed ${fixedCount} users`);
        console.log('Done!');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

cleanupBadges();