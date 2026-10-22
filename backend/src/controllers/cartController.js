const db = require('../config/db');

// Helper: find the logged-in user's cart, or create it if it doesn't exist yet.
async function getOrCreateCart(userId) {
    const [carts] = await db.query('SELECT cart_id FROM cart WHERE user_id = ?', [userId]);
    if (carts.length === 0) {
        const [result] = await db.query('INSERT INTO cart (user_id) VALUES (?)', [userId]);
        return result.insertId;
    }
    return carts[0].cart_id;
}

// GET /api/cart - the logged-in user's cart items, plus the cart total
exports.getCart = async (req, res) => {
    try {
        const cartId = await getOrCreateCart(req.user.user_id);
        const [items] = await db.query(
            `SELECT ci.cart_item_id, ci.product_id, ci.quantity,
                    p.product_name AS name, p.unit_price AS price,
                    p.stock_quantity, p.is_active
             FROM cartitem ci
             JOIN product p ON ci.product_id = p.product_id
             WHERE ci.cart_id = ?`,
            [cartId]
        );

        // Total in cents (whole numbers) to avoid decimal rounding errors.
        // Products that are no longer for sale are not counted.
        let totalCents = 0;
        for (const item of items) {
            if (item.is_active) {
                totalCents += Math.round(Number(item.price) * 100) * item.quantity;
            }
        }

        res.json({ cart_id: cartId, items, total: totalCents / 100 });
    } catch (error) {
        console.error('Get cart failed:', error);
        res.status(500).json({ error: 'Failed to retrieve cart' });
    }
};

// POST /api/cart/items - add a product (or increase its quantity if already in the cart)
exports.addToCart = async (req, res) => {
    const body = req.body || {};

    const productId = Number(body.product_id);
    const qty = body.quantity === undefined ? 1 : Number(body.quantity);

    if (!Number.isInteger(productId) || productId < 1) {
        return res.status(400).json({ error: 'A valid product_id is required.' });
    }
    if (!Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({ error: 'quantity must be a whole number of 1 or more.' });
    }

    try {
        const [products] = await db.query(
            'SELECT stock_quantity, is_active FROM product WHERE product_id = ?',
            [productId]
        );
        if (products.length === 0 || !products[0].is_active) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        const cartId = await getOrCreateCart(req.user.user_id);

        // Friendly early warning only. The REAL stock check is inside checkout.
        const [existing] = await db.query(
            'SELECT quantity FROM cartitem WHERE cart_id = ? AND product_id = ?',
            [cartId, productId]
        );
        const alreadyInCart = existing.length > 0 ? existing[0].quantity : 0;
        const stock = products[0].stock_quantity;

        if (alreadyInCart + qty > stock) {
            return res.status(400).json({
                error: `Only ${stock} in stock (you already have ${alreadyInCart} in your cart).`
            });
        }

        // "Upsert": insert a new row, or add to the quantity if (cart_id, product_id) exists
        await db.query(
            `INSERT INTO cartitem (cart_id, product_id, quantity)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
            [cartId, productId, qty, qty]
        );

        res.json({ message: 'Item added to cart successfully!' });
    } catch (error) {
        console.error('Add to cart failed:', error);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
};

// PUT /api/cart/items/:id - SET an item's quantity (id = cart_item_id)
// Body: { "quantity": 3 }
// Difference from POST: POST adds to the current quantity, PUT replaces it.
// This is what the "+" / "-" buttons in a cart page will call.
exports.updateCartItem = async (req, res) => {
    const itemId = Number(req.params.id);
    const qty = Number((req.body || {}).quantity);

    if (!Number.isInteger(itemId) || itemId < 1) {
        return res.status(400).json({ error: 'Invalid cart item id.' });
    }
    if (!Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({
            error: 'quantity must be a whole number of 1 or more. To remove an item, use DELETE.'
        });
    }

    try {
        const cartId = await getOrCreateCart(req.user.user_id);

        // "AND ci.cart_id = ?" means users can only change items in THEIR OWN cart
        const [rows] = await db.query(
            `SELECT p.stock_quantity, p.is_active
             FROM cartitem ci
             JOIN product p ON ci.product_id = p.product_id
             WHERE ci.cart_item_id = ? AND ci.cart_id = ?`,
            [itemId, cartId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found.' });
        }
        if (!rows[0].is_active) {
            return res.status(400).json({ error: 'This product is no longer available.' });
        }
        if (qty > rows[0].stock_quantity) {
            return res.status(400).json({ error: `Only ${rows[0].stock_quantity} in stock.` });
        }

        await db.query('UPDATE cartitem SET quantity = ? WHERE cart_item_id = ? AND cart_id = ?', [
            qty,
            itemId,
            cartId
        ]);

        res.json({ message: 'Cart updated.', cart_item_id: itemId, quantity: qty });
    } catch (error) {
        console.error('Update cart item failed:', error);
        res.status(500).json({ error: 'Failed to update cart item' });
    }
};

// DELETE /api/cart/items/:id - remove one item (id = cart_item_id)
exports.removeFromCart = async (req, res) => {
    const itemId = Number(req.params.id);
    if (!Number.isInteger(itemId)) {
        return res.status(400).json({ error: 'Invalid cart item id.' });
    }

    try {
        const cartId = await getOrCreateCart(req.user.user_id);

        const [result] = await db.query(
            'DELETE FROM cartitem WHERE cart_item_id = ? AND cart_id = ?',
            [itemId, cartId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cart item not found.' });
        }

        res.json({ message: 'Item removed from cart.' });
    } catch (error) {
        console.error('Remove from cart failed:', error);
        res.status(500).json({ error: 'Failed to remove item' });
    }
};