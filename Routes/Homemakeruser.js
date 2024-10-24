const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Homemaker = require('../Model/Homermakeruser'); // Path to Homemaker model
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Ensure you have this in .env file

// Register Route for Homemakers
router.post('/register', async (req, res) => {
    const { name, username, password } = req.body;

    try {
        let homemaker = await Homemaker.findOne({ username });
        if (homemaker) {
            return res.status(400).json({ message: 'Homemaker already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        homemaker = new Homemaker({
            name,
            username,
            password: hashedPassword,
            role: 'homemaker' // Assign homemaker role by default
        });

        await homemaker.save();
        res.status(201).json({ success: true, message: 'Homemaker registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route for Homemakers
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const homemaker = await Homemaker.findOne({ username });
        if (!homemaker) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, homemaker.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: homemaker._id, role: homemaker.role }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, success: true });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
