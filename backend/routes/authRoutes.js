const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateAvatar, updateProfile, changePassword, syncBadges, forgotPassword, resetPassword, verifyEmail } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { registerValidation, loginValidation, updateProfileValidation, changePasswordValidation } = require('../middleware/validation');

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify/:token', verifyEmail);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfileValidation, updateProfile);
router.put('/password', protect, changePasswordValidation, changePassword);
router.post('/avatar', protect, upload.single('image'), updateAvatar);
router.post('/sync-badges', protect, syncBadges);

module.exports = router;
