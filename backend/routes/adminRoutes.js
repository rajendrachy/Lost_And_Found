const express = require('express');
const router = express.Router();
const { getStats, getUsers, deleteUser, getItems, deleteItem } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/stats', protect, isAdmin, getStats);
router.get('/users', protect, isAdmin, getUsers);
router.delete('/users/:id', protect, isAdmin, deleteUser);
router.get('/items', protect, isAdmin, getItems);
router.delete('/items/:id', protect, isAdmin, deleteItem);

module.exports = router;
