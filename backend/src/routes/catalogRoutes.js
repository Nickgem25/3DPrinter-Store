const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');

// Public endpoints (no login needed). Mounted at /api in server.js, so the full
// URLs are /api/brands and /api/categories.
router.get('/brands', catalogController.getBrands);
router.get('/categories', catalogController.getCategories);

module.exports = router;