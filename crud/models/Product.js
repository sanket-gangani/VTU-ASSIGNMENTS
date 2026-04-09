const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Electronics', 'Laptops', 'Smartphones', 'Accessories', 'Audio']
    },
    inStock: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema);
