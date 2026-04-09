const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// @desc    Get all books
// @route   GET /api/books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find().populate('author', 'name');
        res.status(200).json({ success: true, count: books.length, data: books });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Create new book
// @route   POST /api/books
router.post('/', async (req, res) => {
    try {
        const book = await Book.create(req.body);
        const populatedBook = await Book.findById(book._id).populate('author', 'name');
        res.status(201).json({ success: true, data: populatedBook });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// @desc    Delete book
// @route   DELETE /api/books/:id
router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
