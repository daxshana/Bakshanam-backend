const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { getOrders } = require('../controllers/orderController');
// @route POST /api/register
// @desc Register a new user
router.post('/register', registerUser);

// @route POST /api/login
// @desc Login user and return token
router.post('/login', loginUser);


router.get('/orders', getOrders);

router.get('/users', getUsers);

module.exports = router;
