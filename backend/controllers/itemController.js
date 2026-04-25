const Item = require('../models/Item');
const { uploadToCloudinary } = require('../middleware/upload');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Create a new item (Lost or Found)
exports.createItem = async (req, res) => {
    try {
        const { type, title, description, category, location, date } = req.body;

        let imageUrl = '';
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            imageUrl = result.secure_url;
        } else {
            // Assign custom animated default images if none uploaded
            imageUrl = type === 'found' 
                ? '/images/found_default.png' 
                : '/images/lost_default.png';
        }

        const newItem = new Item({
            type,
            title,
            description,
            category,
            location,
            date,
            image: imageUrl,
            poster: req.user.id
        });

        const item = await newItem.save();
        const populated = await Item.findById(item._id).populate('poster', 'name email phone');
        res.status(201).json(populated);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Get all items
exports.getItems = async (req, res) => {
    try {
        const items = await Item.find()
            .sort({ createdAt: -1 })
            .populate('poster', 'name email phone')
            .populate('returnedBy', 'name')
            .populate('claims.user', 'name');
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Get items by type (lost/found)
exports.getItemsByType = async (req, res) => {
    try {
        const items = await Item.find({ type: req.params.type }).sort({ createdAt: -1 }).populate('poster', 'name email phone');
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Get a single item
exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
            .populate('poster', 'name email phone')
            .populate('returnedBy', 'name')
            .populate('claims.user', 'name');
        if (!item) return res.status(404).json({ msg: 'Item not found' });
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Delete an item (only owner)
exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Item not found' });
        if (item.poster.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        await Item.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Item removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Toggle item status (active/resolved)
exports.toggleStatus = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Item not found' });
        if (item.poster.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        
        const oldStatus = item.status;
        item.status = item.status === 'active' ? 'resolved' : 'active';
        await item.save();

        // AWARD REPUTATION if marked as resolved
        if (oldStatus === 'active' && item.status === 'resolved') {
            const user = await User.findById(req.user.id);
            if (user) {
                user.reputationPoints += 100;
                user.totalResolved += 1;
                user.rating = Math.min(10, Math.floor(user.totalResolved / 1)); 
                await user.save();
            }
        } else if (oldStatus === 'resolved' && item.status === 'active') {
             const user = await User.findById(req.user.id);
             if (user) {
                user.reputationPoints = Math.max(0, user.reputationPoints - 100);
                user.totalResolved = Math.max(0, user.totalResolved - 1);
                user.rating = Math.min(10, Math.floor(user.totalResolved / 1));
                await user.save();
             }
        }

        const populated = await Item.findById(item._id).populate('poster', 'name email phone');
        res.json(populated);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Get items posted by logged-in user
exports.getMyItems = async (req, res) => {
    try {
        const items = await Item.find({ poster: req.user.id })
            .sort({ createdAt: -1 })
            .populate('poster', 'name email phone')
            .populate('claims.user', 'name email phone');
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Owner confirms they got the item back from the founder
exports.confirmRecovery = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('claims.user');
        if (!item) return res.status(404).json({ msg: 'Item not found' });

        const approvedClaim = item.claims.find(c => c.user._id.toString() === req.user.id && c.status === 'approved');
        if (!approvedClaim) {
            return res.status(401).json({ msg: 'You do not have an approved claim for this item' });
        }

        if (item.confirmedByOwner) {
            return res.status(400).json({ msg: 'Recovery already confirmed' });
        }

        item.confirmedByOwner = true;
        
        if (item.type === 'found') {
            item.returnedBy = item.poster; 
        } else {
            item.returnedBy = approvedClaim.user._id;
        }

        item.resolutionStory = req.body.story || `Successfully reunited ${item.title} with its owner.`;
        await item.save();

        await Notification.create({
            recipient: item.poster,
            sender: req.user.id,
            item: item._id,
            type: 'handshake',
            message: `Handshake complete! User confirmed they received ${item.title}. You've earned 500 Hero Points!`
        });

        const founder = await User.findById(item.poster);
        if (founder) {
            founder.reputationPoints += 500; 
            founder.totalResolved += 1;
            founder.rating = Math.min(10, Math.floor(founder.totalResolved / 1));
            await founder.save();
        }

        res.json({ msg: 'Recovery confirmed! Thank you for helping build a trusted community.', item });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Submit a claim for a found item
exports.submitClaim = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Item not found' });
        
        const existingClaim = item.claims.find(c => c.user.toString() === req.user.id);
        if (existingClaim) return res.status(400).json({ msg: 'You have already submitted a claim' });

        item.claims.push({
            user: req.user.id,
            message: req.body.message
        });

        await item.save();

        await Notification.create({
            recipient: item.poster,
            sender: req.user.id,
            item: item._id,
            type: 'claim',
            message: `New claim request for your found item: ${item.title}`
        });

        res.json({ msg: 'Claim submitted successfully. Please wait for the founder to verify.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Verify/Approve a claim
exports.verifyClaim = async (req, res) => {
    try {
        const { claimId } = req.body;
        const item = await Item.findById(req.params.id);
        
        if (!item) return res.status(404).json({ msg: 'Item not found' });
        if (item.poster.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        const claim = item.claims.id(claimId);
        if (!claim) return res.status(404).json({ msg: 'Claim not found' });

        claim.status = 'approved';
        item.status = 'resolved';
        
        item.claims.forEach(c => {
            if (c._id.toString() !== claimId && c.status === 'pending') {
                c.status = 'rejected';
            }
        });

        await item.save();

        await Notification.create({
            recipient: claim.user,
            sender: req.user.id,
            item: item._id,
            type: 'approval',
            message: `Your claim for ${item.title} has been APPROVED! Please arrange a safe return.`
        });

        res.json({ msg: 'Claim verified successfully. Item is now marked as Resolved.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Get items the user has claimed
exports.getMyClaims = async (req, res) => {
    try {
        const items = await Item.find({ 'claims.user': req.user.id })
            .populate('poster', 'name email phone')
            .populate('claims.user', 'name');
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};