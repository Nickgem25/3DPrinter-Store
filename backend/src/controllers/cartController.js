const db = require('../config/db');

// Helper to get or create a cart for the logged-in user
async function getOrCreateCart(userId) {
    let [carts] = await db.query('SELECT cart_id FROM Cart WHERE user_id = ?', [userId]);
    if (carts.length === 0) {
        const [result] = await db.query('INSERT INTO Cart (user_id) VALUES (?)', [userId]);
        return result.insertId;
    }
    return carts[0].cart_id;
}

// GET /api/cart - Retrieve user's active cart items
// GET /api/cart - Retrieve user's active cart items
exports.getCart = async (req, res) => {
    try {
        const cartId = await getOrCreateCart(req.user.user_id);
        const [items] = await db.query(
            `SELECT ci.cart_item_id, ci.product_id, ci.quantity, 
                    p.product_name AS name, p.unit_price AS price, p.stock_quantity
             FROM CartItem ci
             JOIN Product p ON ci.product_id = p.product_id
             WHERE ci.cart_id = ?`,
            [cartId]
        );
        res.json({ cart_id: cartId, items });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve cart', details: error.message });
    }
};

// POST /api/cart/items - Add or update product quantity in cart
exports.addToCart = async (req, res) => {
    const { product_id, quantity } = req.body;
    const qty = parseInt(quantity) || 1;

    if (!product_id) {
        return res.status(400).json({ error: 'Product ID is required.' });
    }

    try {
        const cartId = await getOrCreateCart(req.user.user_id);

        // Upsert into CartItem (increments quantity if product already exists)
        await db.query(
            `INSERT INTO CartItem (cart_id, product_id, quantity)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
            [cartId, product_id, qty]
        );

        res.json({ message: 'Item added to cart successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add item to cart', details: error.message });
    }
};

// DELETE /api/cart/items/:id - Remove item from cart
exports.removeFromCart = async (req, res) => {
    const { id } = req.params; // cart_item_id

    try {
        const cartId = await getOrCreateCart(req.user.user_id);
        await db.query('DELETE FROM CartItem WHERE cart_item_id = ? AND cart_id = ?', [id, cartId]);
        res.json({ message: 'Item removed from cart.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove item', details: error.message });
    }
};