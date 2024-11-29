const express = require('express');
const router = express.Router();
const Product = require('../Model/Product');
const Cart = require('../Model/Cart');

// Route to add product to cart
router.post('/add', async (req, res) => {
  const { productId, quantity, customerName } = req.body;

  try {
    // Find the product in the Product model
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Find or create the cart for the customer
    let cart = await Cart.findOne({ customerName });
    if (!cart) {
      cart = new Cart({ customerName, items: [], totalAmount: 0 });
    }

    // Check if product is already in the cart
    const cartItem = cart.items.find(item => item.product.equals(productId));
    if (cartItem) {
      // Update quantity if product already exists in cart
      cartItem.quantity += quantity;
    } else {
      // Add new product to the cart
      cart.items.push({ product: productId, quantity });
    }

    // Update the total amount
    cart.totalAmount += product.price * quantity;
    await cart.save();

    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error });
  }
});

module.exports = router;
