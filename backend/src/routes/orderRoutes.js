const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Customer endpoints
router.post('/', verifyToken, orderController.createOrder);

// IMPORTANT: '/my-orders' must be declared BEFORE '/:id'.
// Express checks routes top to bottom, so if '/:id' came first it would treat the
// word "my-orders" as an order id.
router.get('/my-orders', verifyToken, orderController.getUserOrders);
router.get('/:id', verifyToken, orderController.getOrderById);

// Admin endpoints (change ['admin'] to ['admin', 'employee'] to let staff manage orders too)
router.get('/', verifyToken, checkRole(['admin']), orderController.getAllOrders);
router.patch('/:id/status', verifyToken, checkRole(['admin']), orderController.updateOrderStatus);

module.exports = router;