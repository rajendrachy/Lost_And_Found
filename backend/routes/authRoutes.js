const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateAvatar, updateProfile, changePassword, syncBadges } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const { upload } = require('../middleware/upload');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/avatar', protect, upload.single('image'), updateAvatar);
router.post('/sync-badges', protect, syncBadges);

module.exports = router;
