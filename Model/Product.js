const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  description: { // Add description field
    type: String,
    required: true // Set to true if it's required, or false if optional
  },
  customerName: { // Add customerName field
    type: String,
    required: true // Set to true if it's required, or false if optional
  },
  Quantity: { // Add quantity field
    type: Number,
    required: true, // Set to true if quantity is mandatory, or false if optional
    min: 0 // Optional: to ensure quantity is non-negative
  }

});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
