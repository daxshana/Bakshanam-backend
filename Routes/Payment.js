const express = require("express");
const router = express.Router();
const Payment = require("../Model/Payment"); // Ensure correct path to Payment model

// POST route to save payment details
router.post("/payments", async (req, res) => {
    const { orderId, payerId, amount, currency, status } = req.body;

    try {
        const payment = new Payment({ orderId, payerId, amount, currency, status });
        await payment.save();
        res.status(201).json({ message: "Payment saved successfully", payment });
    } catch (error) {
        console.error("Error saving payment:", error);
        res.status(500).json({ message: "Error saving payment", error });
    }
});

// GET route to fetch payment details
router.get("/payments", async (req, res) => {
    try {
        const payments = await Payment.find(); // Fetch all payments from the database
        res.status(200).json(payments); // Send the payments data as JSON
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ message: "Error fetching payments", error });
    }
});

module.exports = router;
