// contactRoutes.js
const express = require("express");
const router = express.Router();

const Contact = require("../Model/Contact"); // Import the Contact model

// Endpoint to receive contact form data
router.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;
  console.log(req.body);  // Log to check incoming data

  const newContact = new Contact({ name, email, phone, message });

  try {
    await newContact.save();
    res.status(200).json({ message: 'Contact form submitted successfully!' });
  } catch (error) {
    console.error('Error saving contact submission:', error);  // Log the error details
    res.status(500).json({ message: 'Failed to save contact submission.' });
  }
});


// Endpoint to fetch all contact form submissions
router.get("/contact-submissions", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching submissions", error });
  }
});

module.exports = router;
