// // Model/Homemaker.js

// const mongoose = require('mongoose');

// const homeMakerSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     description: {
//         type: String,
//         required: true,
//     },
//     imageUrls: {
//         type: [String],
//         required: true,
//     },
// });

// module.exports = mongoose.model('HomeMaker', homeMakerSchema);
const mongoose = require('mongoose');
const homeMakerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrls: { type: [String], required: true }, // Only require string paths, not full URLs
});


module.exports = mongoose.model('HomeMaker', homeMakerSchema);
