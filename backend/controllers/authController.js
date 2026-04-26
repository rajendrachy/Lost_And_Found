const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register a new user
// @route   POST api/auth/register
exports.registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');

        user = new User({ 
            name, 
            email, 
            password, 
            phone,
            verificationToken,
            isVerified: false
        });
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.trim() : 'http://localhost:5173';
        const verificationUrl = `${frontendUrl}/verify/${verificationToken}`;
        
        await transporter.sendMail({
            to: email,
            subject: 'Verify your Sajha Khoj account',
            html: `
                <h2>Welcome to Sajha Khoj!</h2>
                <p>Please click the link below to verify your email:</p>
                <a href="${verificationUrl}" style="padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px;">Verify Email</a>
                <p>Or copy this link: ${verificationUrl}</p>
            `
        }).catch(err => console.log('Email error:', err));

        res.status(201).json({
            msg: 'Registration successful. Please check your email to verify account.',
            token: generateToken(user._id)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Authenticate user & get token
// @route   POST api/auth/login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: 'Invalid email or password' });
        }
        
        if (!user.isVerified) {
            return res.status(401).json({ msg: 'Please verify your email first. Check your inbox.' });
        }
        
        // Skip daily login limit check for admin users
        if (user.role !== 'admin') {
            const canLogin = await user.canLoginToday();
            if (!canLogin.can) {
                const nextReset = new Date();
                nextReset.setHours(24, 0, 0, 0);
                
                return res.status(429).json({ 
                    error: 'daily_limit_reached',
                    msg: `You have reached your daily login limit of ${canLogin.max} times per day. You can login minimum ${canLogin.min} and maximum ${canLogin.max} times per day on ${canLogin.plan} plan.`,
                    type: 'limit_exceeded',
                    limit: {
                        min: canLogin.min,
                        max: canLogin.max,
                        used: canLogin.used,
                        remaining: canLogin.remaining,
                        plan: canLogin.plan,
                        isPremium: canLogin.isPremium,
                        resetAt: nextReset.toISOString(),
                        resetIn: 'tomorrow at midnight'
                    },
                    upgrade: {
                        available: !canLogin.isPremium,
                        message: 'Upgrade to Premium for unlimited logins',
                        url: '/plan'
                    }
                });
            }
        }
        
        if (await user.comparePassword(password)) {
            // Only record login for non-admin users
            if (user.role !== 'admin') {
                await user.recordLogin();
            }
            
            // Check and award any missing badges
            user.checkAndAwardBadges();
            await user.save();
            
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
                rating: user.rating,
                reputationPoints: user.reputationPoints,
                totalResolved: user.totalResolved,
                badges: user.badges,
                currentStreak: user.currentStreak,
                longestStreak: user.longestStreak,
                plan: user.plan,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ msg: 'Invalid email or password' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get user profile
// @route   GET api/auth/profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            // Check and award any missing badges for existing users
            const newBadges = user.checkAndAwardBadges();
            if (newBadges.length > 0) {
                await user.save();
            }
            
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
                rating: user.rating,
                reputationPoints: user.reputationPoints,
                totalResolved: user.totalResolved,
                badges: user.badges,
                currentStreak: user.currentStreak,
                longestStreak: user.longestStreak,
                totalItemsPosted: user.totalItemsPosted,
                totalClaimsSubmitted: user.totalClaimsSubmitted
            });
        } else {
            res.status(404).json({ msg: 'User not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update user profile
// @route   PUT api/auth/profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = name || user.name;
            user.phone = phone || user.phone;

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ msg: 'User not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const { uploadToCloudinary } = require('../middleware/upload');

// @desc    Update user avatar
// @route   POST api/auth/avatar
exports.updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No image provided' });
        }
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const result = await uploadToCloudinary(req.file.buffer);
        user.avatar = result.secure_url;
        await user.save();

        res.json({ avatar: user.avatar, msg: 'Avatar updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Current password is incorrect' });
        }

        // Set new password
        user.password = newPassword;
        await user.save();

res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Sync badges for user
// @route   POST api/auth/sync-badges
// @access  Private
exports.syncBadges = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        const newBadges = user.checkAndAwardBadges();
        await user.save();
        
        res.json({
            msg: 'Badges synced',
            badges: user.badges,
            newBadges
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Forgot password - send reset email
// @route   POST api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found with this email' });
        }
        
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000;
        await user.save();
        
        const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.trim() : 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
        
        await transporter.sendMail({
            to: email,
            subject: 'Reset your Sajha Khoj password',
            html: `
                <h2>Password Reset Request</h2>
                <p>Click below to reset your password:</p>
                <a href="${resetUrl}" style="padding: 12px 24px; background: #ef4444; color: white; text-decoration: none; border-radius: 8px;">Reset Password</a>
                <p>This link expires in 1 hour.</p>
            `
        }).catch(err => console.log('Email error:', err));
        
        res.json({ msg: 'Password reset link sent to your email' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Reset password
// @route   POST api/auth/reset-password
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    
    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired reset token' });
        }
        
        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
        
        res.json({ msg: 'Password reset successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Verify email
// @route   GET api/auth/verify/:token
exports.verifyEmail = async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });
        
        if (!user) {
            return res.status(400).json({ msg: 'Invalid verification token' });
        }
        
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        
        res.json({ msg: 'Email verified successfully! You can now login.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Request premium plan
// @route   POST api/auth/request-plan
exports.requestPlan = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        if (user.plan === 'premium') {
            return res.status(400).json({ msg: 'You already have a premium plan' });
        }
        
        if (user.planRequest && user.planRequest.status === 'pending') {
            return res.status(400).json({ msg: 'You already have a pending plan request' });
        }
        
        const { message } = req.body;
        user.planRequest = {
            status: 'pending',
            message: message || 'I want to buy the premium plan for unlimited features.',
            requestedAt: new Date()
        };
        await user.save();
        
        res.json({ msg: 'Plan request submitted. Admin will review it.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get plan status
// @route   GET api/auth/plan-status
exports.getPlanStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        const isPremium = user.hasPremium();
        
        res.json({
            plan: user.plan,
            planStartDate: user.planStartDate,
            planEndDate: user.planEndDate,
            isPremium: isPremium === true,
            isExpired: isPremium === 'expired',
            planRequest: user.planRequest,
            dailyItemLimit: user.getDailyItemLimit(),
            dailyLoginLimit: user.getDailyLoginLimit()
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
