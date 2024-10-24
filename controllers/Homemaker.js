// // controllers/homeMakerController.js
// const HomeMaker = require('../Model/Homemaker'); // Adjust the path as necessary

// // Create a new homemaker
// exports.createHomeMaker = async (req, res) => {
//   try {
//     const homeMaker = new HomeMaker(req.body);
//     await homeMaker.save();
//     res.status(201).json(homeMaker);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Get all homemakers
// exports.getAllHomeMakers = async (req, res) => {
//   try {
//     const homeMakers = await HomeMaker.find();
//     res.status(200).json(homeMakers);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get a homemaker by ID
// exports.getHomeMakerById = async (req, res) => {
//   try {
//     const homeMaker = await HomeMaker.findById(req.params.id);
//     if (!homeMaker) {
//       return res.status(404).json({ message: 'Homemaker not found' });
//     }
//     res.status(200).json(homeMaker);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update a homemaker
// exports.updateHomeMaker = async (req, res) => {
//   try {
//     const homeMaker = await HomeMaker.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!homeMaker) {
//       return res.status(404).json({ message: 'Homemaker not found' });
//     }
//     res.status(200).json(homeMaker);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete a homemaker
// exports.deleteHomeMaker = async (req, res) => {
//   try {
//     const homeMaker = await HomeMaker.findByIdAndDelete(req.params.id);
//     if (!homeMaker) {
//       return res.status(404).json({ message: 'Homemaker not found' });
//     }
//     res.status(204).json(); // No content
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
