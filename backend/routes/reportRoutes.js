const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

router.post('/', async (req, res) => {
    try {
        const { subject, category, message, userId } = req.body;
        
        const newReport = new Report({
            subject,
            category,
            message,
            userId,
            status: 'pending'
        });
        
        await newReport.save();
        res.status(201).json(newReport);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const report = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;