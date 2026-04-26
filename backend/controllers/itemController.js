const Item = require('../models/Item');
const { uploadToCloudinary } = require('../middleware/upload');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Create a new item (Lost or Found)
exports.createItem = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        // Skip daily item limit check for admin users
        let canCreate = { can: true, min: 1, max: 999, used: 0, remaining: 999, isPremium: true, plan: 'admin' };
        
        if (user.role !== 'admin') {
            canCreate = await user.canCreateItem();
            
            if (!canCreate.can) {
                const nextReset = new Date();
                nextReset.setHours(24, 0, 0, 0);
                
                return res.status(429).json({ 
                    error: 'daily_limit_reached',
                    msg: `You have reached your daily limit of ${canCreate.max} items per day. You can create minimum ${canCreate.min} and maximum ${canCreate.max} items per day on ${canCreate.plan} plan.`,
                    type: 'limit_exceeded',
                    limit: {
                        min: canCreate.min,
                        max: canCreate.max,
                        used: canCreate.used,
                        remaining: canCreate.remaining,
                        plan: canCreate.plan,
                        isPremium: canCreate.isPremium,
                        resetAt: nextReset.toISOString(),
                        resetIn: 'tomorrow at midnight'
                    },
                    upgrade: {
                        available: !canCreate.isPremium,
                        message: 'Upgrade to Premium for unlimited items',
                        url: '/plan'
                    }
                });
            }
        }

        const limitInfo = {
            min: canCreate.min,
            max: canCreate.max,
            used: canCreate.isPremium ? 0 : (canCreate.used || 0),
            remaining: canCreate.remaining,
            plan: canCreate.plan
        };

        const { type, title, description, category, location, date, reward } = req.body;

        let parsedDate = date;
        if (date) {
            parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                parsedDate = date;
            }
        }

        let parsedReward = undefined;
        if (type === 'found' && reward) {
            try {
                parsedReward = typeof reward === 'string' ? JSON.parse(reward) : reward;
            } catch (e) {
                parsedReward = { amount: 0, currency: 'NPR', description: '' };
            }
        }

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
            date: parsedDate,
            image: imageUrl,
            poster: req.user.id,
            reward: type === 'found' ? {
                amount: parsedReward?.amount || 0,
                currency: parsedReward?.currency || 'NPR',
                description: parsedReward?.description || ''
            } : undefined
        });

        await newItem.save();
        
        // Only record item count for non-admin users
        if (user.role !== 'admin') {
            await user.recordItemCreated();
        }
        
        const populated = await Item.findById(newItem._id).populate('poster', 'name email phone');
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
        
        if (item.status === 'active') {
            return res.status(400).json({ msg: 'Items must be resolved through the Verification Desk by approving a valid claim.' });
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
        const item = await Item.findById(req.params.id).populate('claims.user').populate('returnedBy');
        if (!item) return res.status(404).json({ msg: 'Item not found' });

        const approvedClaim = item.claims.find(c => c.user._id.toString() === req.user.id && c.status === 'approved');
        if (!approvedClaim) {
            return res.status(401).json({ msg: 'You do not have an approved claim for this item' });
        }

        if (item.confirmedByOwner) {
            return res.status(400).json({ msg: 'Recovery already confirmed' });
        }

        item.confirmedByOwner = true;
        item.status = 'resolved';
        
        if (item.type === 'found') {
            item.returnedBy = item.poster; 
        } else {
            item.returnedBy = approvedClaim.user._id;
        }

        // Handle reward for found items
        if (item.type === 'found' && item.reward?.amount > 0 && item.reward?.claimed === false) {
            item.reward.claimed = true;
            item.reward.claimedBy = approvedClaim.user._id;
            item.reward.claimedAt = new Date();
        }

        item.resolutionStory = req.body.story || `Successfully reunited ${item.title} with its owner.`;
        await item.save();

        // Notify the finder that reward is ready
        if (item.type === 'found' && item.reward?.amount > 0) {
            await Notification.create({
                recipient: approvedClaim.user._id,
                sender: item.poster,
                item: item._id,
                type: 'reward',
                message: `🎉 Great news! The owner confirmed receiving ${item.title}. Your reward of ${item.reward.currency} ${item.reward.amount} is ready! Please contact the owner to receive it.`
            });
        }

        // Award points and badges to the finder
        const finder = await User.findById(item.poster);
        if (finder) {
            finder.reputationPoints += 500;
            finder.totalResolved += 1;
            finder.rating = Math.min(10, Math.floor(finder.totalResolved / 1));
            
            // Check for new badges
            const newBadges = finder.checkAndAwardBadges();
            await finder.save();

            // Notify about new badges
            for (const badge of newBadges) {
                await Notification.create({
                    recipient: finder._id,
                    sender: item.poster,
                    item: item._id,
                    type: 'badge',
                    message: `🏆 Congratulations! You earned the "${badge.name}" badge for resolving ${badge.threshold} items! ${badge.description}`
                });
            }

            await Notification.create({
                recipient: item.poster,
                sender: req.user.id,
                item: item._id,
                type: 'handshake',
                message: `Handshake complete! User confirmed they received ${item.title}. You've earned 500 Hero Points!`
            });
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
        
        if (item.status === 'resolved') {
            return res.status(400).json({ msg: 'This item has already been resolved. You cannot submit a claim.' });
        }
        
        if (item.type === 'lost' && item.poster.toString() === req.user.id) {
            return res.status(400).json({ msg: 'You cannot claim your own lost item.' });
        }
        if (item.type === 'found' && item.poster.toString() === req.user.id) {
            return res.status(400).json({ msg: 'You cannot claim your own found item.' });
        }
        
        const existingClaim = item.claims.find(c => c.user.toString() === req.user.id);
        if (existingClaim) return res.status(400).json({ msg: 'You have already submitted a claim' });

        item.claims.push({
            user: req.user.id,
            message: req.body.message,
            phone: req.body.phone,
            email: req.body.email
        });

        await item.save();

        await Notification.create({
            recipient: item.poster,
            sender: req.user.id,
            item: item._id,
            type: 'claim',
            message: item.type === 'lost' 
                ? `Someone says they found your lost item: ${item.title}` 
                : `New claim request for your found item: ${item.title}`
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