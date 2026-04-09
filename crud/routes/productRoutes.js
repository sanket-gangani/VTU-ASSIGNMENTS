const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Activity = require('../models/Activity');

// @desc    Get all products
// @route   GET /api/products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Create new product
// @route   POST /api/products
router.post('/', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        
        await Activity.create({
            action: 'CREATE',
            taskTitle: product.name,
            details: `Product added to inventory in ${product.category} category. Price: $${product.price}`
        });

        res.status(201).json({ success: true, data: product });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Update product
// @route   PUT /api/products/:id
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        await Activity.create({
            action: 'UPDATE',
            taskTitle: product.name,
            details: `Product inventory updated. Stock: ${product.inStock ? 'In Stock' : 'Out of Stock'}`
        });

        res.status(200).json({ success: true, data: product });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        await Activity.create({
            action: 'DELETE',
            taskTitle: product.name,
            details: `Product removed from store catalog`
        });

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
