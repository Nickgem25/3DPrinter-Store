const db = require('../config/db');

// GET /api/brands - all brands, A to Z (public)
// Used by the shop's filters and by the admin "add product" form's dropdown.
exports.getBrands = async (req, res) => {
    try {
        const [brands] = await db.query('SELECT brand_id, brand_name FROM brand ORDER BY brand_name');
        res.json(brands);
    } catch (error) {
        console.error('Fetch brands failed:', error);
        res.status(500).json({ error: 'Failed to fetch brands' });
    }
};

// GET /api/categories - all categories, A to Z (public)
exports.getCategories = async (req, res) => {
    try {
        const [categories] = await db.query(
            'SELECT category_id, category_name FROM category ORDER BY category_name'
        );
        res.json(categories);
    } catch (error) {
        console.error('Fetch categories failed:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};