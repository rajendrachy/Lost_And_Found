const User = require('../models/User');
const jwt = require('jsonwebtoken');

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

        user = new User({ name, email, password, phone });
        await user.save();

        res.status(201).json({
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
        if (user && (await user.comparePassword(password))) {
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
