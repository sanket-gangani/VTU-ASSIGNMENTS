const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a book title']
    },
    genre: {
        type: String
    },
    publishedYear: {
        type: Number
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'Author',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Book', BookSchema);
