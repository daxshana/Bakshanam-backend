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
const contactRoutes = require("./Routes/contactRoutes");
const authRoutes = require('./Routes/Auth');
const paymentRoutes = require("./Routes/Payment"); // Adjust path as necessary
const cartRoutes = require("./Routes/Cart");
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

// // Authentication middleware
// const authMiddleware = (req, res, next) => {
//     const token = req.header('Authorization');
//     if (!token) {
//         return res.status(401).json({ message: 'No token, authorization denied' });
//     }

//     try {
//         const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
//         req.user = decoded.user; // Assign user data to request object
//         next();
//     } catch (err) {
//         res.status(401).json({ message: 'Token is not valid' });
//     }
// };

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    // Check if Authorization header exists and is in Bearer token format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Please check your login status.' });
    }

    // Extract the token from the "Bearer <token>" format
    const token = authHeader.split(' ')[1];

    // Verify the token
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user; // Attach user info to request
        next(); // Proceed to next middleware or route handler
    } catch (err) {
        console.error("Token verification error:", err.message);
        res.status(401).json({ message: 'Token is not valid or has expired.' });
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

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Include user role in the JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role }, // Including role in the token
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ success: true, message: 'Login successful', token, role: user.role,userId: user._id });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error. Try again later.' });
    }
});

// Fetch user details by ID
app.get('/api/auth/user/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Validate if ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: 'Server error. Try again later.' });
    }
});



// Protecting user routes with auth middleware
app.use('/api/users', userRouter);
app.use('/api/orders', ordersRoutes); // Ensure this path is correct
app.use('/api/home-makers', homeMakersRoutes);
app.use('/api/products', productRoutes); // Ensure this path is correct
app.use('/uploads', express.static('uploads')); 
app.use('/api/homemakeruser', HomemakeruserRoutes);
app.use("/api", contactRoutes);
app.use("/api", paymentRoutes);
app.use("/api/cart", cartRoutes);


app.us
// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
