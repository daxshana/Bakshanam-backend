const express = require("express");
const multer = require("multer");
const Product = require("../Model/Product");
const path = require('path'); 
const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/; // Define allowed file types
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase()); // Check extension
  const mimetype = allowedTypes.test(file.mimetype); // Check MIME type

  if (extname && mimetype) {
    return cb(null, true); // Allow file
  } else {
    cb(new Error('Only image files are allowed!'), false); // Reject file
  }
};

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter: fileFilter,
});

// Define a POST route to upload images
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.status(200).send('File uploaded successfully.');
});
// Add a new product
router.post("/", upload.single('image'), async (req, res) => { // Ensure 'image' matches frontend form field
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description || '', // Optional description
      imageUrl: `/uploads/${req.file.filename}`, // Set imageUrl to the URL path
      customerName: req.body.customerName
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting product" });
  }
});
// Update a product
router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body; // Extract description
  const updatedData = {
    name,
    price,
    description,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined // Update imageUrl if a new image is uploaded
  };


  try {
    // Update product in the database
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct); // Return the updated product
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Multer error handling middleware
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(500).json({ message: err.message });
  }
  next(err);
});

module.exports = router;
