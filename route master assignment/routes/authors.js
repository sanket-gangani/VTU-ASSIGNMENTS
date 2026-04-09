const express = require('express');
const router = express.Router();
const Author = require('../models/Author');

// @desc    Get all authors
// @route   GET /api/authors
router.get('/', async (req, res) => {
    try {
        const authors = await Author.find();
        res.status(200).json({ success: true, count: authors.length, data: authors });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Create new author
// @route   POST /api/authors
router.post('/', async (req, res) => {
    try {
        const author = await Author.create(req.body);
        res.status(201).json({ success: true, data: author });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;
