const express = require('express');
const router = express.Router();
const { 
  createItem, getItems, getItemsByType, getItemById, 
  deleteItem, toggleStatus, getMyItems, submitClaim, verifyClaim, confirmRecovery, getMyClaims 
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { createItemValidation, claimValidation, verifyClaimValidation, confirmRecoveryValidation } = require('../middleware/itemValidation');

router.post('/', protect, upload.single('image'), createItemValidation, createItem);

router.get('/', getItems);

router.get('/my', protect, getMyItems);

router.get('/my-claims', protect, getMyClaims);

router.get('/type/:type', getItemsByType);

router.get('/:id', getItemById);

router.delete('/:id', protect, deleteItem);

router.patch('/:id/status', protect, toggleStatus);

router.post('/:id/claim', protect, claimValidation, submitClaim);

router.post('/:id/verify', protect, verifyClaimValidation, verifyClaim);

router.post('/:id/confirm-recovery', protect, confirmRecoveryValidation, confirmRecovery);

module.exports = router;



