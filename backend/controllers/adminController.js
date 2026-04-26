const User = require('../models/User');
const Item = require('../models/Item');

// @desc    Get dashboard stats
// @route   GET api/admin/stats
exports.getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const itemCount = await Item.countDocuments();
        const resolvedCount = await Item.countDocuments({ status: 'resolved' });
        res.json({ users: userCount, items: itemCount, resolved: resolvedCount });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all users
// @route   GET api/admin/users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete user
// @route   DELETE api/admin/users/:id
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        await Item.deleteMany({ poster: req.params.id }); // delete user's items
        res.json({ msg: 'User and their items deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all items
// @route   GET api/admin/items
exports.getItems = async (req, res) => {
    try {
        const items = await Item.find().populate('poster', 'name email').sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete item
// @route   DELETE api/admin/items/:id
exports.deleteItem = async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Item deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all plan requests
// @route   GET api/admin/plan-requests
exports.getPlanRequests = async (req, res) => {
    try {
        const users = await User.find({ 
            'planRequest.status': { $in: ['pending', 'approved', 'rejected'] }
        }).select('name email planRequest');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Approve or reject plan request
// @route   POST api/admin/plan-requests/:userId
exports.respondPlanRequest = async (req, res) => {
    try {
        const { action, response } = req.body;
        const user = await User.findById(req.params.userId);
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        if (action === 'approve') {
            const planEndDate = new Date();
            planEndDate.setFullYear(planEndDate.getFullYear() + 1);
            
            user.plan = 'premium';
            user.planStartDate = new Date();
            user.planEndDate = planEndDate;
            user.planRequest = {
                status: 'approved',
                adminResponse: response || 'Your premium plan has been approved!',
                respondedAt: new Date()
            };
        } else {
            user.planRequest = {
                status: 'rejected',
                adminResponse: response || 'Your plan request was rejected.',
                respondedAt: new Date()
            };
        }
        
        await user.save();
        res.json({ msg: `Plan request ${action}ed`, user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
