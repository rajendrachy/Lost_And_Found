const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['lost', 'found']
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    image: {
        type: String, // Cloudinary URL
        required: false
    },
    poster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'resolved'],
        default: 'active'
    },
    reward: {
        amount: { type: Number, default: 0 },
        currency: { type: String, default: 'NPR' },
        description: String,
        claimed: { type: Boolean, default: false },
        claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        claimedAt: Date
    },
    claims: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: String,
        phone: String,
        email: String,
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        createdAt: { type: Date, default: Date.now }
    }],
    returnedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    confirmedByOwner: { type: Boolean, default: false },
    resolutionStory: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
