require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Declare cors only once
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./Model/User'); // Ensure the path is correct
const userRouter = require('./Routes/User'); // Adjust the path as needed
const ordersRoutes = require('./Routes/order'); // Import your orders routes
const productRoutes = require('./Routes/Product'); // Adjust the path if necessary
const multer = require('multer');
const homeMakersRoutes = require('./Routes/Homemaker'); // Adjust the path as necessary
const HomemakeruserRoutes = require("./Routes/Homemakeruser");
// const paypal = require('@paypal/checkout-server-sdk');
; // Ensure the path is correct

const app = express();
const PORT = process.env.PORT || 5004;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors()); // Use cors middleware
app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Authentication middleware
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
        req.user = decoded.user; // Assign user data to request object
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Registration route
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error. Try again later.' });
    }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    console.log("Login Attempt:", { email, password }); // Log the attempt

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found"); // Log if the user doesn't exist
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch"); // Log if passwords don't match
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ success: true, message: 'Login successful', token });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error. Try again later.' });
    }
});

// Protecting user routes with auth middleware
app.use('/api/users', authMiddleware, userRouter);
app.use('/api/orders', ordersRoutes); // Ensure this path is correct
app.use('/api/home-makers', homeMakersRoutes);
app.use('/api/products', productRoutes); // Ensure this path is correct
app.use('/uploads', express.static('uploads')); 
app.use('/api/homemakeruser', HomemakeruserRoutes);



app.us
// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
