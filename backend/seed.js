const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Check and create normal user
        let user = await User.findOne({ email: 'user@gmail.com' });
        if (!user) {
            user = new User({ name: 'Test User', email: 'user@gmail.com', password: 'password123', role: 'user' });
            await user.save();
            console.log('Created user@gmail.com');
        } else {
            user.password = 'password123';
            await user.save();
            console.log('Updated user@gmail.com password');
        }

        // Check and create admin user
        let admin = await User.findOne({ email: 'admin@gmail.com' });
        if (!admin) {
            admin = new User({ name: 'System Admin', email: 'admin@gmail.com', password: 'password123', role: 'admin' });
            await admin.save();
            console.log('Created admin@gmail.com');
        } else {
            admin.password = 'password123';
            admin.role = 'admin';
            await admin.save();
            console.log('Updated admin@gmail.com password and role');
        }

        console.log('Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
