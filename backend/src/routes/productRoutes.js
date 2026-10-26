const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/', productController.getAllProducts);

// IMPORTANT: '/admin/all' must be declared BEFORE '/:id', otherwise Express would
// treat the word "admin" as a product id (same reason '/my-orders' comes before '/:id' for orders).
router.get('/admin/all', verifyToken, checkRole(['admin']), productController.getAllProductsAdmin);

router.get('/:id', productController.getProductById);

// Admin-only endpoints
router.post('/', verifyToken, checkRole(['admin']), productController.createProduct);
router.put('/:id', verifyToken, checkRole(['admin']), productController.updateProduct);
router.delete('/:id', verifyToken, checkRole(['admin']), productController.deleteProduct);
router.delete(
    '/:id/permanent',
    verifyToken,
    checkRole(['admin']),
    productController.deleteProductPermanently
);
module.exports = router;
