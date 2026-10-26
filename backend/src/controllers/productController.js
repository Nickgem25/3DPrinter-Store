const db = require('../config/db');

// ---------- small helpers ----------

// true for 0, 19.99, "19.99" ... false for -1, "abc", "", null, undefined
const isNonNegativeNumber = (v) =>
    v !== null && v !== '' && Number.isFinite(Number(v)) && Number(v) >= 0;

// same idea but whole numbers only (for stock)
const isNonNegativeInteger = (v) =>
    v !== null && v !== '' && Number.isInteger(Number(v)) && Number(v) >= 0;

// The columns both "get" endpoints return. brand_id and category_id are included
// so an admin edit form knows which brand/category is currently selected.
const PRODUCT_SELECT = `
    SELECT p.product_id, p.sku, p.product_name, p.description, p.image_url,
           p.unit_price, p.stock_quantity, p.is_active,
           p.brand_id, b.brand_name,
           p.category_id, c.category_name
    FROM product p
    LEFT JOIN brand b ON p.brand_id = b.brand_id
    LEFT JOIN category c ON p.category_id = c.category_id
`;

// Turns common database errors into proper HTTP responses (used by create + update)
function sendWriteError(res, error, action) {
    // ER_DUP_ENTRY: the UNIQUE key on sku was violated
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'A product with that SKU already exists.' });
    }
    // ER_NO_REFERENCED_ROW_2: a foreign key points at a brand/category that doesn't exist
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ error: 'brand_id or category_id does not exist.' });
    }
    console.error(`Failed to ${action} product:`, error);
    res.status(500).json({ error: `Failed to ${action} product` });
}

// ---------- endpoints ----------

// GET /api/products - public catalog (only active products)
exports.getAllProducts = async (req, res) => {
    try {
        const [products] = await db.query(`${PRODUCT_SELECT} WHERE p.is_active = 1`);
        res.json(products);
    } catch (error) {
        console.error('Fetch products failed:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

// GET /api/products/admin/all - EVERY product, including hidden ones (admin only)
// The public list only shows active products, so without this an admin could never
// see a hidden product again to restore it.
exports.getAllProductsAdmin = async (req, res) => {
    try {
        const [products] = await db.query(`${PRODUCT_SELECT} ORDER BY p.product_id`);
        res.json(products);
    } catch (error) {
        console.error('Fetch admin products failed:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

// GET /api/products/:id - one active product
exports.getProductById = async (req, res) => {
    try {
        const [rows] = await db.query(
            `${PRODUCT_SELECT} WHERE p.product_id = ? AND p.is_active = 1`,
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Fetch product failed:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

// POST /api/products - create a product (admin only)
exports.createProduct = async (req, res) => {
    const { product_name, sku, unit_price, stock_quantity, description, image_url, brand_id, category_id } =
        req.body || {};

    // sku is NOT NULL + UNIQUE in the table, so it must be required here too
    if (!product_name || !sku) {
        return res.status(400).json({ error: 'product_name and sku are required.' });
    }
    if (!isNonNegativeNumber(unit_price)) {
        return res.status(400).json({ error: 'unit_price must be a number, 0 or greater.' });
    }
    if (!isNonNegativeInteger(stock_quantity)) {
        return res.status(400).json({ error: 'stock_quantity must be a whole number, 0 or greater.' });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO product (product_name, sku, unit_price, stock_quantity, description, image_url, brand_id, category_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                product_name,
                sku,
                unit_price,
                stock_quantity,
                description || '',
                image_url || null,
                brand_id || null,
                category_id || null
            ]
        );

        res.status(201).json({
            message: 'Product created successfully!',
            product_id: result.insertId
        });
    } catch (error) {
        sendWriteError(res, error, 'create');
    }
};

// PUT /api/products/:id - partial update (admin only). Send only the fields to change.
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { product_name, sku, unit_price, stock_quantity, description, image_url, brand_id, category_id, is_active } =
        req.body || {};

    // Only validate fields that were actually sent
    if (product_name === '' || sku === '') {
        return res.status(400).json({ error: 'product_name and sku cannot be empty.' });
    }
    if (unit_price !== undefined && !isNonNegativeNumber(unit_price)) {
        return res.status(400).json({ error: 'unit_price must be a number, 0 or greater.' });
    }
    if (stock_quantity !== undefined && !isNonNegativeInteger(stock_quantity)) {
        return res.status(400).json({ error: 'stock_quantity must be a whole number, 0 or greater.' });
    }
    if (is_active !== undefined && ![true, false, 0, 1].includes(is_active)) {
        return res.status(400).json({ error: 'is_active must be true/false (or 1/0).' });
    }

    try {
        // COALESCE(?, column) = "use the new value if one was sent (not NULL),
        // otherwise keep the current value". That's what makes the update partial.
        // "?? null" turns a missing field (undefined) into NULL.
        const [result] = await db.query(
            `UPDATE product
             SET product_name   = COALESCE(?, product_name),
                 sku            = COALESCE(?, sku),
                 unit_price     = COALESCE(?, unit_price),
                 stock_quantity = COALESCE(?, stock_quantity),
                 description    = COALESCE(?, description),
                 image_url      = COALESCE(?, image_url),
                 brand_id       = COALESCE(?, brand_id),
                 category_id    = COALESCE(?, category_id),
                 is_active      = COALESCE(?, is_active)
             WHERE product_id = ?`,
            [
                product_name ?? null,
                sku ?? null,
                unit_price ?? null,
                stock_quantity ?? null,
                description ?? null,
                image_url ?? null,
                brand_id ?? null,
                category_id ?? null,
                is_active === undefined ? null : (is_active ? 1 : 0),
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        res.json({ message: 'Product updated successfully!' });
    } catch (error) {
        sendWriteError(res, error, 'update');
    }
};

// DELETE /api/products/:id - SOFT delete (admin only)
// We don't remove the row. Old orders point at it through a foreign key, so a real
// DELETE would fail. We just mark it inactive, which hides it from the catalog and
// blocks new purchases. An admin can bring it back with PUT { "is_active": true }.
exports.deleteProduct = async (req, res) => {
    try {
        const [result] = await db.query('UPDATE product SET is_active = 0 WHERE product_id = ?', [
            req.params.id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        res.json({ message: 'Product removed from the catalog.' });
    } catch (error) {
        console.error('Delete product failed:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

exports.deleteProductPermanently = async (req, res) => {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId < 1) {
        return res.status(400).json({
            error: 'Invalid product ID.'
        });
    }

    try {
        const [result] = await db.query(
            'DELETE FROM product WHERE product_id = ?',
            [productId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Product not found.'
            });
        }

        res.json({
            message: 'Product permanently deleted.'
        });
    } catch (error) {
        console.error('Permanent deletion failed:', error);
        res.status(500).json({
            error: 'Failed to permanently delete product.'
        });
    }
};
