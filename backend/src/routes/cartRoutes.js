const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middleware/authMiddleware');

// All cart endpoints require user authentication
router.get('/', verifyToken, cartController.getCart);
router.post('/items', verifyToken, cartController.addToCart);
router.delete('/items/:id', verifyToken, cartController.removeFromCart);

module.exports = router;