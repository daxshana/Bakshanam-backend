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
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
