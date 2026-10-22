const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middleware/authMiddleware');

// All cart endpoints require the user to be logged in
router.get('/', verifyToken, cartController.getCart);
router.post('/items', verifyToken, cartController.addToCart);
router.put('/items/:id', verifyToken, cartController.updateCartItem);
router.delete('/items/:id', verifyToken, cartController.removeFromCart);

module.exports = router;