const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const HomeMaker = require('../Model/Homemaker'); // Adjust path as necessary
const router = express.Router();

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // directory to save images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // unique file name
    },
});

const upload = multer({ storage: storage });

// Get all home makers
router.get('/getHomeMakers', async (req, res) => {
    try {
        const homeMakers = await HomeMaker.find();
        res.json(homeMakers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a new home maker with image upload
router.post('/addHomeMaker', upload.array('images', 10), async (req, res) => { // Accept multiple files
    const { name, description } = req.body;
    const imageUrls = req.files.map(file => file.path); // Save paths of uploaded images

    const newHomeMaker = new HomeMaker({
        name,
        description,
        imageUrls,
    });

    try {
        const savedHomeMaker = await newHomeMaker.save();
        res.status(201).json(savedHomeMaker);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Update a home maker
router.put('/updateHomeMaker/:id', upload.array('images', 10), async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const imageUrls = req.files ? req.files.map(file => file.path) : []; // Handle uploaded files

    // Validate input data
    if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
    }

    try {
        // Find existing home maker
        const existingHomeMaker = await HomeMaker.findById(id);
        if (!existingHomeMaker) {
            return res.status(404).json({ error: 'Home maker not found' });
        }

        // Merge new imageUrls with existing ones if images are provided
        const updatedHomeMaker = await HomeMaker.findByIdAndUpdate(
            id,
            { 
                name,
                description,
                imageUrls: imageUrls.length > 0 ? imageUrls : existingHomeMaker.imageUrls // Keep existing if no new images
            },
            { new: true, runValidators: true } // runValidators to ensure schema validation
        );

        res.json(updatedHomeMaker);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Error updating home maker' });
    }
});

// Delete a homemaker
router.delete("/deleteHomeMaker/:id", async (req, res) => {
    const homeMakerId = req.params.id;

    // Validate the ID format before attempting deletion
    if (!mongoose.Types.ObjectId.isValid(homeMakerId)) {
        return res.status(400).json({ message: "Invalid homemaker ID format" });
    }

    try {
        const deletedHomeMaker = await HomeMaker.findByIdAndDelete(homeMakerId);

        if (!deletedHomeMaker) {
            return res.status(404).json({ message: "Home maker not found" });
        }

        res.status(200).json({ success: true, message: "Home maker deleted successfully" });
    } catch (error) {
        console.error("Server error during deletion:", error);
        res.status(500).json({ message: "Server error" });
    }
});



module.exports = router;



// const express = require('express');
// const multer = require('multer');
// const HomeMaker = require('../Model/Homemaker'); // Adjust path as necessary
// const router = express.Router();

// // Set up multer for file storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // directory to save images
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname); // unique file name
//     },
// });

// const upload = multer({ storage: storage });

// // Get all home makers
// router.get('/getHomeMakers', async (req, res) => {
//     try {
//         const homeMakers = await HomeMaker.find();
//         res.json(homeMakers);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // Add a new home maker with image upload
// router.post('/addHomeMaker', upload.array('images', 10), async (req, res) => {
//     const { name, description, username } = req.body; // Get username from request body
//     const imageUrls = req.files.map(file => file.path); // Save paths of uploaded images

//     // Check if username is provided
//     if (!username) {
//         return res.status(400).json({ message: 'Username is required' });
//     }

//     const newHomeMaker = new HomeMaker({
//         name,
//         description,
//         username, // Save username
//         imageUrls,
//     });

//     try {
//         const savedHomeMaker = await newHomeMaker.save();
//         res.status(201).json(savedHomeMaker);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// // Update a home maker
// router.put('/updateHomeMaker/:id', async (req, res) => {
//     const { id } = req.params;
//     const { name, description, username, imageUrls } = req.body; // Include username in the update

//     try {
//         const updatedHomeMaker = await HomeMaker.findByIdAndUpdate(
//             id,
//             { name, description, username, imageUrls }, // Include username in update
//             { new: true }
//         );
//         res.json(updatedHomeMaker);
//     } catch (err) {
//         res.status(500).json({ error: 'Error updating home maker' });
//     }
// });

// // Delete a homemaker
// router.delete('/deleteHomeMaker/:id', async (req, res) => {
//     const homeMakerId = req.params.id; // Get ID from URL

//     try {
//         const deletedHomeMaker = await HomeMaker.findByIdAndDelete(homeMakerId);
//         if (!deletedHomeMaker) {
//             return res.status(404).json({ message: 'Home maker not found' });
//         }
//         res.status(200).json({ success: true, message: 'Home maker deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// module.exports = router;
