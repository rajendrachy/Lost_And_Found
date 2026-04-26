const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const badgeSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
        required: true
    },
    name: String,
    description: String,
    earnedAt: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: ''
    },
    rating: { type: Number, default: 0, min: 0, max: 10 },
    reputationPoints: { type: Number, default: 0 },
    totalResolved: { type: Number, default: 0 },
    badges: [badgeSchema],
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalItemsPosted: { type: Number, default: 0 },
    totalClaimsSubmitted: { type: Number, default: 0 }
}, { timestamps: true });

// Badge definitions
userSchema.statics.BADGE_TIERS = [
    { threshold: 1, type: 'bronze', name: 'First Find', description: 'Resolved your first item!' },
    { threshold: 5, type: 'bronze', name: 'Rising Hero', description: 'Resolved 5 items' },
    { threshold: 10, type: 'silver', name: 'Community Helper', description: 'Resolved 10 items' },
    { threshold: 25, type: 'silver', name: 'Trusted Finder', description: 'Resolved 25 items' },
    { threshold: 50, type: 'gold', name: 'Hero Award', description: 'Resolved 50 items' },
    { threshold: 100, type: 'gold', name: 'Super Hero', description: 'Resolved 100 items' },
    { threshold: 200, type: 'platinum', name: 'Legend', description: 'Resolved 200 items' },
    { threshold: 500, type: 'diamond', name: 'Master', description: 'Resolved 500 items' }
];

// Method to check and award badges
userSchema.methods.checkAndAwardBadges = function() {
    if (!this.badges) {
        this.badges = [];
    }
    const newBadges = [];
    const currentBadges = this.badges.map(b => b.type + b.threshold);
    
    for (const badge of User.BADGE_TIERS) {
        const badgeKey = badge.type + badge.threshold;
        if (this.totalResolved >= badge.threshold && !currentBadges.includes(badgeKey)) {
            this.badges.push({
                type: badge.type,
                name: badge.name,
                description: badge.description,
                earnedAt: new Date()
            });
            newBadges.push(badge);
        }
    }
    return newBadges;
};

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
