const User = require('../models/User');
const Item = require('../models/Item');


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

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.approveUserAccount = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ msg: 'Admin accounts do not need approval.' });
        }

        user.isApproved = true;
        user.approvedAt = new Date();
        user.approvedBy = req.user.id;

        if (!user.isVerified) {
            user.isVerified = true;
        }

        await user.save();

        res.json({
            msg: 'User account approved successfully.',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                isApproved: user.isApproved
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

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

exports.getItems = async (req, res) => {
    try {
        const items = await Item.find().populate('poster', 'name email').sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.deleteItem = async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Item deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

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



