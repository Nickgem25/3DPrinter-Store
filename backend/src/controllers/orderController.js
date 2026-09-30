const db = require('../config/db');

// POST /api/orders - Checkout active cart
exports.createOrder = async (req, res) => {
    const userId = req.user.user_id;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Fetch user's cart and items
        const [carts] = await connection.query('SELECT cart_id FROM Cart WHERE user_id = ?', [userId]);
        if (carts.length === 0) {
            await connection.rollback();
            return res.status(400).json({ error: 'No active cart found.' });
        }

        const cartId = carts[0].cart_id;
        const [cartItems] = await connection.query(
            `SELECT ci.product_id, ci.quantity, p.unit_price, p.stock_quantity, p.product_name
             FROM CartItem ci
             JOIN Product p ON ci.product_id = p.product_id
             WHERE ci.cart_id = ?`,
            [cartId]
        );

        if (cartItems.length === 0) {
            await connection.rollback();
            return res.status(400).json({ error: 'Your cart is empty.' });
        }

        // 2. Validate stock availability & calculate total price
        let totalAmount = 0;
        for (const item of cartItems) {
            if (item.stock_quantity < item.quantity) {
                await connection.rollback();
                return res.status(400).json({
                    error: `Insufficient stock for '${item.product_name}'. Available: ${item.stock_quantity}, requested: ${item.quantity}`
                });
            }
            totalAmount += item.unit_price * item.quantity;
        }

        // 3. Create Order record
        const [orderResult] = await connection.query(
            'INSERT INTO `Order` (user_id, total_amount, status) VALUES (?, ?, "Pending")',
            [userId, totalAmount]
        );
        const orderId = orderResult.insertId;

        // 4. Insert OrderItems & decrement stock for each product
        for (const item of cartItems) {
            await connection.query(
                'INSERT INTO OrderItem (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.unit_price]
            );

            await connection.query(
                'UPDATE Product SET stock_quantity = stock_quantity - ? WHERE product_id = ?',
                [item.quantity, item.product_id]
            );
        }

        // 5. Clear the user's cart
        await connection.query('DELETE FROM CartItem WHERE cart_id = ?', [cartId]);

        // Commit transaction
        await connection.commit();

        res.status(201).json({
            message: 'Order placed successfully!',
            order_id: orderId,
            total_amount: totalAmount
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: 'Checkout failed', details: error.message });
    } finally {
        connection.release();
    }
};

// GET /api/orders/my-orders - Get customer order history
exports.getUserOrders = async (req, res) => {
    try {
        const [orders] = await db.query(
            'SELECT * FROM `Order` WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.user_id]
        );
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
    }
};