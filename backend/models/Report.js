const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    category: { type: String, required: true, enum: ['general', 'bug', 'claim', 'safety', 'harassment', 'other'] },
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'pending', enum: ['pending', 'reviewed', 'resolved'] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);