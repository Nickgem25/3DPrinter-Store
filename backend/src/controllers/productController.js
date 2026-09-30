const db = require('../config/db');

// @desc    Get all products with Brand and Category names
// @route   GET /api/products
exports.getAllProducts = async (req, res) => {
    try {
        const query = `
      SELECT 
        p.product_id,
        p.sku,
        p.product_name,
        p.description,
        p.unit_price,
        p.stock_quantity,
        b.brand_name,
        c.category_name
      FROM Product p
      LEFT JOIN Brand b ON p.brand_id = b.brand_id
      LEFT JOIN Category c ON p.category_id = c.category_id
    `;
        const [products] = await db.query(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products', details: error.message });
    }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
      SELECT 
        p.product_id,
        p.sku,
        p.product_name,
        p.description,
        p.unit_price,
        p.stock_quantity,
        b.brand_name,
        c.category_name
      FROM Product p
      LEFT JOIN Brand b ON p.brand_id = b.brand_id
      LEFT JOIN Category c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `;
        const [rows] = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product', details: error.message });
    }
};

// @desc    Create new product
// @route   POST /api/products
exports.createProduct = async (req, res) => {
    const { product_name, sku, unit_price, stock_quantity, description, brand_id, category_id } = req.body;

    if (!product_name || unit_price === undefined || stock_quantity === undefined) {
        return res.status(400).json({ error: 'product_name, unit_price, and stock_quantity are required.' });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO Product (product_name, sku, unit_price, stock_quantity, description, brand_id, category_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [product_name, sku || null, unit_price, stock_quantity, description || '', brand_id || null, category_id || null]
        );

        res.status(201).json({
            message: 'Product created successfully!',
            product_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product', details: error.message });
    }
};

// @desc    Update existing product details or stock
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { product_name, sku, unit_price, stock_quantity, description, brand_id, category_id } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE Product 
             SET product_name = COALESCE(?, product_name),
                 sku = COALESCE(?, sku),
                 unit_price = COALESCE(?, unit_price),
                 stock_quantity = COALESCE(?, stock_quantity),
                 description = COALESCE(?, description),
                 brand_id = COALESCE(?, brand_id),
                 category_id = COALESCE(?, category_id)
             WHERE product_id = ?`,
            [product_name, sku, unit_price, stock_quantity, description, brand_id, category_id, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        res.json({ message: 'Product updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product', details: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM Product WHERE product_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        res.json({ message: 'Product deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product', details: error.message });
    }
};