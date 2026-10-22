const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./src/config/db');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const authRoutes = require('./src/routes/authRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const catalogRoutes = require('./src/routes/catalogRoutes'); // NEW

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api', catalogRoutes); // NEW: /api/brands and /api/categories

// Health Check Route
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        res.json({ message: 'Server & Database Connected Successfully!', testResult: rows[0].result });
    } catch (error) {
        res.status(500).json({ error: 'Database Connection Failed', details: error.message });
    }
});

// ---- NEW: these two MUST stay at the very bottom, after all the routes ----

// 404: nothing above matched the URL. Without this, Express sends an HTML page,
// which is awkward for a frontend that expects JSON.
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.' });
});

// Error handler (Express recognizes it by its 4 parameters). It catches errors
// thrown anywhere above, for example malformed JSON sent in a request body.
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON in request body.' });
    }
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});