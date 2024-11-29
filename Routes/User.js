

// const express = require('express');
// const User = require('../Model/User');
// const router = express.Router();

// // // Get all users - only accessible by admin
// router.get('/', async (req, res) => {
//     try {
//         const users = await User.find();
//         res.json(users);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Save a new user - open for all (adjust as necessary)
// router.post('/',  async (req, res) => {
//     const { name, email, role } = req.body;

//     const newUser = new User({
//         name,
//         email,
//         role,
//     });

//     try {
//         const savedUser = await newUser.save();
//         res.status(201).json(savedUser);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// // Update a user - only accessible by admin
// router.put('/:id', async (req, res) => {
//     const { id } = req.params;

//     try {
//         const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
//         if (!updatedUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.json(updatedUser);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// // Block/Unblock a user - only accessible by admin
// router.put('/:id/block', async (req, res) => {
//     const { id } = req.params;

//     try {
//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         user.isBlocked = !user.isBlocked; // Toggle the isBlocked status
//         await user.save();

//         res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}` });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// // Export the router
// module.exports = router;







const express = require('express');
const User = require('../Model/User');
const router = express.Router();
const jwt = require('jsonwebtoken');


// Get all users - no authentication required

router.get('/get', async (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        // Extract the token after 'Bearer ' prefix
        const tokenWithoutBearer = token.split(' ')[1];

        // Verify the token
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

        // Token is valid, proceed to fetch users
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
});


// Save a new user - open for all (adjust as necessary)
router.post('/', async (req, res) => {
    const { name, email, role } = req.body;

    const newUser = new User({
        name,
        email,
        role,
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a user - no authentication required for simplicity (adjust as necessary)
router.put('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Block/Unblock a user - no authentication required for simplicity (adjust as necessary)
router.put('/:id/block', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isBlocked = !user.isBlocked; // Toggle the isBlocked status
        await user.save();

        res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}); 



module.exports = router;
