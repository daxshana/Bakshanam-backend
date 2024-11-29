
// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../Model/order');
 // Import PayPal service

// Create a new order
router.post('/', async (req, res) => {
    const { customerName, items, totalAmount } = req.body;
    try {
        const newOrder = new Order({ customerName, items, totalAmount });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log('Received userId:', userId);  // Debugging the userId value

    try {
        // Query for orders matching the userId
        const orders = await Order.find({ userId });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user.' });
        }
        
        res.status(200).json(orders);  // Send the found orders back
    } catch (error) {
        console.error('Error fetching orders:', error.message);  // Log the error for debugging
        res.status(500).json({ message: 'An error occurred while fetching orders.' });
    }
});




// Update an order by ID
router.patch('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an order status by ID
router.patch('/:id/status', async (req, res) => {
    const { status } = req.body; // Expecting the new status in the request body

    // Validate the status
    if (!['pending', 'in progress', 'completed', 'canceled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: Date.now() }, // Update the status and timestamp
            { new: true } // Return the updated order
        );

        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Delete an order by ID
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create PayPal Order
router.post('/paypal/create-order', async (req, res) => {
    const { amount } = req.body; // Amount should be passed from the frontend
    try {
        const order = await createOrder(amount);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Capture PayPal Order
router.post('/paypal/capture-order/:orderId', async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await captureOrder(orderId);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
