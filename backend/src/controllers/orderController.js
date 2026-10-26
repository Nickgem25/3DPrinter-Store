const db = require('../config/db');

// The valid order statuses. Must match the ENUM on the `order` table.
const VALID_STATUSES = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];

// Which status may change into which. Anything not listed here is rejected.
// Example: a Delivered order can't go back to Pending, and a Shipped order
// can't be cancelled (it has already left the shop).
const ALLOWED_TRANSITIONS = {
    Pending: ['Paid', 'Cancelled'],
    Paid: ['Shipped', 'Cancelled'],
    Shipped: ['Delivered'],
    Delivered: [],
    Cancelled: []
};

// An error we throw ON PURPOSE when the request is wrong (empty cart, not enough
// stock, bad status change...). Throwing it jumps to the catch block, which rolls
// back the transaction and answers with the right HTTP status instead of a 500.
class ApiError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}

// POST /api/orders - checkout the logged-in user's cart
exports.createOrder = async (req, res) => {
    const userId = req.user.user_id;
    const body = req.body || {};
    let connection;

    try {
        // ---- Step 1: work out the shipping address (before any transaction) ----
        let shippingAddress =
            typeof body.shipping_address === 'string' ? body.shipping_address.trim() : '';

        if (!shippingAddress) {
            const [users] = await db.query('SELECT address FROM `user` WHERE user_id = ?', [userId]);
            if (users.length > 0 && users[0].address) {
                shippingAddress = users[0].address.trim();
            }
        }
        if (!shippingAddress) {
            throw new ApiError(
                'A shipping address is required. Send shipping_address or save an address on your profile.'
            );
        }

        // ---- Step 2: dedicated connection + start the transaction ----
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [carts] = await connection.query('SELECT cart_id FROM cart WHERE user_id = ?', [userId]);
        if (carts.length === 0) {
            throw new ApiError('No active cart found.');
        }
        const cartId = carts[0].cart_id;

        // ---- Step 3: read the cart and LOCK the product rows (FOR UPDATE) ----
        // Stops two customers from buying the last item at the same moment.
        // ORDER BY keeps the lock order consistent, which avoids deadlocks.
        const [cartItems] = await connection.query(
            `SELECT ci.product_id, ci.quantity,
            p.product_name, p.sku,
            p.unit_price, p.stock_quantity, p.is_active
             FROM cartitem ci
             JOIN product p ON ci.product_id = p.product_id
             WHERE ci.cart_id = ?
             ORDER BY ci.product_id
             FOR UPDATE`,
            [cartId]
        );

        if (cartItems.length === 0) {
            throw new ApiError('Your cart is empty.');
        }

        // ---- Step 4: validate items, add up the total in cents ----
        let totalCents = 0;
        for (const item of cartItems) {
            if (!item.is_active) {
                throw new ApiError(
                    `'${item.product_name}' is no longer available. Please remove it from your cart.`
                );
            }
            if (item.stock_quantity < item.quantity) {
                throw new ApiError(
                    `Insufficient stock for '${item.product_name}'. Available: ${item.stock_quantity}, requested: ${item.quantity}`
                );
            }
            totalCents += Math.round(Number(item.unit_price) * 100) * item.quantity;
        }
        const totalAmount = totalCents / 100;

        // ---- Step 5: create the order ----
        const [orderResult] = await connection.query(
            "INSERT INTO `order` (user_id, total_amount, shipping_address, status) VALUES (?, ?, ?, 'Pending')",
            [userId, totalAmount, shippingAddress]
        );
        const orderId = orderResult.insertId;

        // ---- Step 6: save the line items (price at this moment) and reduce stock ----

        for (const item of cartItems) {
            await connection.query(
                `INSERT INTO orderitem
                 (order_id, product_id, product_name_at_purchase,
                  sku_at_purchase, quantity, price_at_purchase)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    orderId,
                    item.product_id,
                    item.product_name,
                    item.sku,
                    item.quantity,
                    item.unit_price
                ]
            );

            await connection.query(
                'UPDATE product SET stock_quantity = stock_quantity - ? WHERE product_id = ?',
                [item.quantity, item.product_id]
            );
        }


        // ---- Step 7: empty the cart and make everything permanent ----
        await connection.query('DELETE FROM cartitem WHERE cart_id = ?', [cartId]);
        await connection.commit();

        res.status(201).json({
            message: 'Order placed successfully!',
            order_id: orderId,
            total_amount: totalAmount
        });
    } catch (error) {
        if (connection) await connection.rollback();

        if (error instanceof ApiError) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error('Checkout failed:', error);
        res.status(500).json({ error: 'Checkout failed. Please try again.' });
    } finally {
        if (connection) connection.release();
    }
};

// GET /api/orders/my-orders - the logged-in customer's order history (newest first)
exports.getUserOrders = async (req, res) => {
    try {
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

// GET /api/orders/:id - one order with its items.
// Customers can only open THEIR OWN orders. Admins can open any order.
exports.getOrderById = async (req, res) => {
    const orderId = Number(req.params.id);
    if (!Number.isInteger(orderId) || orderId < 1) {
        return res.status(400).json({ error: 'Invalid order id.' });
    }

    try {
        const [orders] = await db.query(
            `SELECT o.order_id, o.user_id,
                    u.full_name AS customer_name, u.email AS customer_email,
                    o.order_date, o.total_amount, o.shipping_address, o.status
             FROM \`order\` o
             JOIN \`user\` u ON o.user_id = u.user_id
             WHERE o.order_id = ?`,
            [orderId]
        );

        const order = orders[0];
        const isAdmin = req.user.role === 'admin';

        // We answer 404 (not 403) for someone else's order. A 403 would confirm
        // "that order exists", which lets people probe order numbers.
        if (!order || (!isAdmin && order.user_id !== req.user.user_id)) {
            return res.status(404).json({ error: 'Order not found.' });
        }


        const [items] = await db.query(
            `SELECT
                oi.order_item_id,
                oi.product_id,
                oi.product_name_at_purchase AS product_name,
                oi.sku_at_purchase AS sku,
                oi.quantity,
                oi.price_at_purchase,
                (oi.quantity * oi.price_at_purchase) AS line_total,
            CASE
                WHEN oi.product_id IS NULL THEN 1
                ELSE 0
            END AS is_deleted
             FROM orderitem oi
             WHERE oi.order_id = ?`,
            [orderId]
        );

        res.json({ ...order, items });
    } catch (error) {
        console.error('Fetch order failed:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};

// GET /api/orders - ALL orders (admin only). Optional filter: /api/orders?status=Pending
exports.getAllOrders = async (req, res) => {
    const { status } = req.query;

    // Only accept a status we know. This also rejects things like ?status=a&status=b
    if (status !== undefined && !VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    try {
        // The WHERE text below is fixed by us (never typed by the user). The status
        // VALUE still goes through a "?" placeholder, so it stays safe from SQL injection.
        const where = status ? 'WHERE o.status = ?' : '';
        const params = status ? [status] : [];

        const [orders] = await db.query(
            `SELECT o.order_id, o.user_id,
                    u.full_name AS customer_name, u.email AS customer_email,
                    o.order_date, o.total_amount, o.shipping_address, o.status
             FROM \`order\` o
             JOIN \`user\` u ON o.user_id = u.user_id
             ${where}
             ORDER BY o.order_date DESC, o.order_id DESC`,
            params
        );
        res.json(orders);
    } catch (error) {
        console.error('Fetch all orders failed:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// PATCH /api/orders/:id/status - change an order's status (admin only)
// Body: { "status": "Shipped" }
exports.updateOrderStatus = async (req, res) => {
    const orderId = Number(req.params.id);
    const { status: newStatus } = req.body || {};

    if (!Number.isInteger(orderId) || orderId < 1) {
        return res.status(400).json({ error: 'Invalid order id.' });
    }
    if (!VALID_STATUSES.includes(newStatus)) {
        return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Lock the order row so two admins can't change it at the same time
        const [orders] = await connection.query(
            'SELECT status FROM `order` WHERE order_id = ? FOR UPDATE',
            [orderId]
        );
        if (orders.length === 0) {
            throw new ApiError('Order not found.', 404);
        }

        const currentStatus = orders[0].status;
        if (!(ALLOWED_TRANSITIONS[currentStatus] || []).includes(newStatus)) {
            throw new ApiError(`Cannot change an order from '${currentStatus}' to '${newStatus}'.`);
        }

        // Cancelling puts the items back in stock. This is in the SAME transaction
        // as the status change, so either both happen or neither does.
        if (newStatus === 'Cancelled') {
            await connection.query(
                `UPDATE product p
                 JOIN orderitem oi ON oi.product_id = p.product_id
                 SET p.stock_quantity = p.stock_quantity + oi.quantity
                 WHERE oi.order_id = ?`,
                [orderId]
            );
        }

        await connection.query('UPDATE `order` SET status = ? WHERE order_id = ?', [newStatus, orderId]);
        await connection.commit();

        res.json({ message: 'Order status updated.', order_id: orderId, status: newStatus });
    } catch (error) {
        if (connection) await connection.rollback();

        if (error instanceof ApiError) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error('Update order status failed:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    } finally {
        if (connection) connection.release();
    }
};