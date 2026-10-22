const db = require('../config/db');

// An error we throw ON PURPOSE when the customer did something wrong
// (empty cart, not enough stock, no address...). Throwing it jumps straight
// to the catch block below, which rolls back and answers with a 400
// instead of a 500 "server error".
class CheckoutError extends Error { }

// POST /api/orders - checkout the logged-in user's cart
exports.createOrder = async (req, res) => {
    const userId = req.user.user_id;
    const body = req.body || {};
    let connection;

    try {
        // ---- Step 1: work out the shipping address (before any transaction) ----
        // The `order` table requires shipping_address (NOT NULL). Use the one sent
        // in the request, or fall back to the address saved on the user's profile.
        let shippingAddress =
            typeof body.shipping_address === 'string' ? body.shipping_address.trim() : '';

        if (!shippingAddress) {
            const [users] = await db.query('SELECT address FROM `user` WHERE user_id = ?', [userId]);
            if (users.length > 0 && users[0].address) {
                shippingAddress = users[0].address.trim();
            }
        }
        if (!shippingAddress) {
            throw new CheckoutError(
                'A shipping address is required. Send shipping_address or save an address on your profile.'
            );
        }

        // ---- Step 2: open a dedicated connection and start the transaction ----
        // A transaction = "all or nothing". If anything fails, rollback() undoes
        // every change made since beginTransaction().
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [carts] = await connection.query('SELECT cart_id FROM cart WHERE user_id = ?', [userId]);
        if (carts.length === 0) {
            throw new CheckoutError('No active cart found.');
        }
        const cartId = carts[0].cart_id;

        // ---- Step 3: read the cart AND LOCK the product rows ----
        // FOR UPDATE tells the database: "I'm going to change these rows, so make
        // anyone else who wants them wait until I commit or roll back."
        // Without it, two customers buying the last item at the same moment would
        // both see stock = 1, both pass the check, and the stock would go to -1.
        // ORDER BY product_id makes every checkout lock rows in the same order,
        // which avoids "deadlocks" (two transactions waiting on each other).
        const [cartItems] = await connection.query(
            `SELECT ci.product_id, ci.quantity,
                    p.product_name, p.unit_price, p.stock_quantity, p.is_active
             FROM cartitem ci
             JOIN product p ON ci.product_id = p.product_id
             WHERE ci.cart_id = ?
             ORDER BY ci.product_id
             FOR UPDATE`,
            [cartId]
        );

        if (cartItems.length === 0) {
            throw new CheckoutError('Your cart is empty.');
        }

        // ---- Step 4: validate every item and add up the total ----
        // Money is added up in CENTS (whole numbers). Decimal numbers like 19.99
        // can't be stored exactly in JavaScript, so adding them directly can give
        // results like 59.97000000000001.
        let totalCents = 0;
        for (const item of cartItems) {
            if (!item.is_active) {
                throw new CheckoutError(
                    `'${item.product_name}' is no longer available. Please remove it from your cart.`
                );
            }
            if (item.stock_quantity < item.quantity) {
                throw new CheckoutError(
                    `Insufficient stock for '${item.product_name}'. Available: ${item.stock_quantity}, requested: ${item.quantity}`
                );
            }
            // mysql2 returns DECIMAL columns as strings, so convert with Number()
            totalCents += Math.round(Number(item.unit_price) * 100) * item.quantity;
        }
        const totalAmount = totalCents / 100;

        // ---- Step 5: create the order ----
        const [orderResult] = await connection.query(
            "INSERT INTO `order` (user_id, total_amount, shipping_address, status) VALUES (?, ?, ?, 'Pending')",
            [userId, totalAmount, shippingAddress]
        );
        const orderId = orderResult.insertId;

        // ---- Step 6: save each line item (with the price at this moment) and reduce stock ----
        // price_at_purchase is copied so old orders keep their price even if the
        // product's price changes later.
        for (const item of cartItems) {
            await connection.query(
                'INSERT INTO orderitem (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.unit_price]
            );

            await connection.query(
                'UPDATE product SET stock_quantity = stock_quantity - ? WHERE product_id = ?',
                [item.quantity, item.product_id]
            );
        }

        // ---- Step 7: empty the cart, then make everything permanent ----
        await connection.query('DELETE FROM cartitem WHERE cart_id = ?', [cartId]);
        await connection.commit();

        res.status(201).json({
            message: 'Order placed successfully!',
            order_id: orderId,
            total_amount: totalAmount
        });
    } catch (error) {
        // Undo everything if a transaction was open (harmless if it wasn't)
        if (connection) await connection.rollback();

        if (error instanceof CheckoutError) {
            return res.status(400).json({ error: error.message });
        }
        console.error('Checkout failed:', error);
        res.status(500).json({ error: 'Checkout failed. Please try again.' });
    } finally {
        // ALWAYS give the connection back to the pool, success or failure
        if (connection) connection.release();
    }
};

// GET /api/orders/my-orders - the logged-in customer's order history (newest first)
exports.getUserOrders = async (req, res) => {
    try {
        // The column is order_date (there is no created_at on the order table).
        // order_id DESC breaks ties between orders placed in the same second.
        const [orders] = await db.query(
            `SELECT order_id, order_date, total_amount, shipping_address, status
             FROM \`order\`
             WHERE user_id = ?
             ORDER BY order_date DESC, order_id DESC`,
            [req.user.user_id]
        );
        res.json(orders);
    } catch (error) {
        console.error('Fetch orders failed:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};