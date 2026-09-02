const express = require('express');
const router = express.Router();
const { getStats, getUsers, approveUserAccount, deleteUser, getItems, deleteItem, getPlanRequests, respondPlanRequest } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/stats', protect, isAdmin, getStats);
router.get('/users', protect, isAdmin, getUsers);
router.post('/users/:userId/approve', protect, isAdmin, approveUserAccount);
router.delete('/users/:id', protect, isAdmin, deleteUser);
router.get('/items', protect, isAdmin, getItems);
router.delete('/items/:id', protect, isAdmin, deleteItem);
router.get('/plan-requests', protect, isAdmin, getPlanRequests);
router.post('/plan-requests/:userId', protect, isAdmin, respondPlanRequest);

module.exports = router;
