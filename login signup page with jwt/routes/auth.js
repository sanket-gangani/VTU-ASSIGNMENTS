const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user
        user = await User.create({
            username,
            password
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please login.'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate credentials
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Please provide username and password' });
        }

        // Check for user
        const user = await User.findOne({ username }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        // Set cookie options
        const options = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            httpOnly: true, // Prevent XSS
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        };

        res.status(200)
            .cookie('token', token, options)
            .json({
                success: true,
                message: 'Logged in successfully',
                username: user.username
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private (though clearing cookie is fine anytime)
router.get('/logout', (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});

module.exports = router;
