const express = require('express');
const router = express.Router();
const { 
  createItem, getItems, getItemsByType, getItemById, 
  deleteItem, toggleStatus, getMyItems, submitClaim, verifyClaim, confirmRecovery, getMyClaims 
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// @route   POST api/items
// @desc    Create a lost/found item with image upload
// @access  Private
router.post('/', protect, upload.single('image'), createItem);

// @route   GET api/items
// @desc    Get all items
// @access  Public
router.get('/', getItems);

// @route   GET api/items/my
// @desc    Get items posted by logged in user
// @access  Private
router.get('/my', protect, getMyItems);

// @route   GET api/items/my-claims
// @desc    Get items claimed by logged in user
// @access  Private
router.get('/my-claims', protect, getMyClaims);

// @route   GET api/items/type/:type
// @desc    Get items by type (lost/found)
// @access  Public
router.get('/type/:type', getItemsByType);

// @route   GET api/items/:id
// @desc    Get item by ID
// @access  Public
router.get('/:id', getItemById);

// @route   DELETE api/items/:id
// @desc    Delete an item
// @access  Private
router.delete('/:id', protect, deleteItem);

// @route   PATCH api/items/:id/status
// @desc    Toggle item status
// @access  Private
router.patch('/:id/status', protect, toggleStatus);

// @route   POST api/items/:id/claim
// @desc    Submit a claim
// @access  Private
router.post('/:id/claim', protect, submitClaim);

// @route   POST api/items/:id/verify
// @desc    Verify a claim
// @access  Private
router.post('/:id/verify', protect, verifyClaim);

// @route   POST api/items/:id/confirm-recovery
// @desc    Owner confirms receipt
// @access  Private
router.post('/:id/confirm-recovery', protect, confirmRecovery);

module.exports = router;
