const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// @desc    Get all activities
// @route   GET /api/activities
router.get('/', async (req, res) => {
    try {
        const activities = await Activity.find().sort({ timestamp: -1 }).limit(50);
        res.status(200).json({ success: true, count: activities.length, data: activities });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
