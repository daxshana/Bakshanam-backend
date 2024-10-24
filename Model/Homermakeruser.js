const mongoose = require('mongoose');

const HomemakerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true }, // Added username field
    password: { type: String, required: true },
    role: { type: String, default: 'homemaker' }
});

module.exports = mongoose.model('Homemaker', HomemakerSchema);
