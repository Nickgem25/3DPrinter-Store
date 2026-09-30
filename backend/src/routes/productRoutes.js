const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin-only endpoints
router.post('/', verifyToken, checkRole(['admin']), productController.createProduct);
router.put('/:id', verifyToken, checkRole(['admin']), productController.updateProduct);
router.delete('/:id', verifyToken, checkRole(['admin']), productController.deleteProduct);

module.exports = router;