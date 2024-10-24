
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
router.put('/updateHomeMaker/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, imageUrls } = req.body;

    try {
        const updatedHomeMaker = await HomeMaker.findByIdAndUpdate(
            id,
            { name, description, imageUrls },
            { new: true }
        );
        res.json(updatedHomeMaker);
    } catch (err) {
        res.status(500).json({ error: 'Error updating home maker' });
    }
});
// Delete a homemaker
router.delete('/deleteHomeMaker/:id', async (req, res) => {
    const homeMakerId = req.params.id; // URL இல் இருந்து ID ஐப் பெறவும்

    try {
        const deletedHomeMaker = await HomeMaker.findByIdAndDelete(homeMakerId);
        if (!deletedHomeMaker) {
            return res.status(404).json({ message: 'Home maker not found' });
        }
        res.status(200).json({ success: true, message: 'Home maker deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;
