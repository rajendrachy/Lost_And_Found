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
    totalClaimsSubmitted: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: true },
    verificationToken: String,
    resetToken: String,
    resetTokenExpiry: Date,
    plan: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free'
    },
    planStartDate: Date,
    planEndDate: Date,
    itemsCreatedToday: { type: Number, default: 0 },
    itemsCreatedDate: { type: Date, default: null },
    dailyItemResetAt: { type: Date, default: null },
    loginCount: { type: Number, default: 0 },
    loginDate: { type: Date, default: null },
    loginResetAt: { type: Date, default: null },
    planRequest: {
        status: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
        message: String,
        requestedAt: Date,
        adminResponse: String,
        respondedAt: Date
    }
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
    const currentBadgeNames = this.badges.map(b => b.name);
    
    for (const badge of this.constructor.BADGE_TIERS) {
        if (this.totalResolved >= badge.threshold && !currentBadgeNames.includes(badge.name)) {
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

// Free plan limits per day
const FREE_ITEM_MIN = 1;
const FREE_ITEM_MAX = 12;
const FREE_LOGIN_MIN = 1;
const FREE_LOGIN_MAX = 12;

// Premium plan limits (unlimited)
const PREMIUM_LIMIT = 999;

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.hasPremium = function() {
    if (this.plan === 'premium') {
        if (this.planEndDate && this.planEndDate > new Date()) {
            return true;
        }
        if (this.planEndDate && this.planEndDate <= new Date()) {
            return 'expired';
        }
        return true;
    }
    return false;
};

userSchema.methods.getDailyItemLimit = function() {
    const premium = this.hasPremium();
    if (premium === true) return PREMIUM_LIMIT;
    if (premium === 'expired') return FREE_ITEM_MAX;
    return FREE_ITEM_MAX;
};

userSchema.methods.getDailyLoginLimit = function() {
    const premium = this.hasPremium();
    if (premium === true) return PREMIUM_LIMIT;
    if (premium === 'expired') return FREE_LOGIN_MAX;
    return FREE_LOGIN_MAX;
};

userSchema.methods.canCreateItem = async function() {
    const limit = this.getDailyItemLimit();
    
    // Admin or premium gets unlimited
    if (this.role === 'admin' || limit >= PREMIUM_LIMIT) return { 
        can: true, 
        remaining: 999,
        min: FREE_ITEM_MIN,
        max: 999,
        isPremium: true,
        plan: this.plan || 'premium'
    };
    
    const now = new Date();
    const isNewDay = !this.itemsCreatedDate || now.toDateString() !== this.itemsCreatedDate.toDateString();
    
    // Reset count for new day (don't save yet)
    if (isNewDay) {
        return { 
            can: true, 
            remaining: FREE_ITEM_MAX,
            min: FREE_ITEM_MIN,
            max: FREE_ITEM_MAX,
            isPremium: false,
            plan: this.plan
        };
    }
    
    if (this.itemsCreatedToday >= FREE_ITEM_MAX) {
        return { 
            can: false, 
            remaining: 0,
            min: FREE_ITEM_MIN,
            max: FREE_ITEM_MAX,
            used: this.itemsCreatedToday,
            isPremium: false,
            plan: this.plan,
            resetAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
        };
    }
    
    return { 
        can: true, 
        remaining: FREE_ITEM_MAX - this.itemsCreatedToday,
        min: FREE_ITEM_MIN,
        max: FREE_ITEM_MAX,
        used: this.itemsCreatedToday,
        isPremium: false,
        plan: this.plan
    };
};

userSchema.methods.recordItemCreated = async function() {
    const now = new Date();
    if (!this.itemsCreatedDate || now.toDateString() !== this.itemsCreatedDate.toDateString()) {
        this.itemsCreatedDate = now;
        this.itemsCreatedToday = 1;
    } else {
        this.itemsCreatedToday += 1;
    }
    this.totalItemsPosted += 1;
    await this.save();
};

userSchema.methods.canLoginToday = async function() {
    const limit = this.getDailyLoginLimit();
    
    // Admin or premium gets unlimited
    if (this.role === 'admin' || limit >= PREMIUM_LIMIT) return { 
        can: true, 
        remaining: 999,
        min: FREE_LOGIN_MIN,
        max: 999,
        isPremium: true,
        plan: this.plan || 'premium'
    };
    
    const now = new Date();
    const isNewDay = !this.loginDate || now.toDateString() !== this.loginDate.toDateString();
    
    // Reset count for new day (don't save yet)
    if (isNewDay) {
        return { 
            can: true, 
            remaining: FREE_LOGIN_MAX,
            min: FREE_LOGIN_MIN,
            max: FREE_LOGIN_MAX,
            isPremium: false,
            plan: this.plan
        };
    }
    
    if (this.loginCount >= FREE_LOGIN_MAX) {
        return { 
            can: false, 
            remaining: 0,
            min: FREE_LOGIN_MIN,
            max: FREE_LOGIN_MAX,
            used: this.loginCount,
            isPremium: false,
            plan: this.plan,
            resetAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
        };
    }
    
    return { 
        can: true, 
        remaining: FREE_LOGIN_MAX - this.loginCount,
        min: FREE_LOGIN_MIN,
        max: FREE_LOGIN_MAX,
        used: this.loginCount,
        isPremium: false,
        plan: this.plan
    };
};

userSchema.methods.recordLogin = async function() {
    const now = new Date();
    if (!this.loginDate || now.toDateString() !== this.loginDate.toDateString()) {
        this.loginDate = now;
        this.loginCount = 1;
    } else {
        this.loginCount += 1;
    }
    await this.save();
};

module.exports = mongoose.model('User', userSchema);
