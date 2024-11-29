const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  customerName: { // Track the customer for the cart
    type: String,
    required: true
  },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Reference to Product model
      quantity: { type: Number, required: true, default: 1 } // Quantity of each product
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = mongoose.model("Cart", cartSchema);
