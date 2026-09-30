const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new customer
exports.register = async (req, res) => {
    const { email, password, full_name, phone, address } = req.body;

    if (!email || !password || !full_name) {
        return res.status(400).json({ error: 'Email, password, and full name are required.' });
    }

    try {
        // Check if email already exists
        const [existing] = await db.query('SELECT user_id FROM User WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email is already registered.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insert new user with default role 'customer'
        const [result] = await db.query(
            'INSERT INTO User (email, password_hash, full_name, phone, address, role) VALUES (?, ?, ?, ?, ?, "customer")',
            [email, password_hash, full_name, phone || null, address || null]
        );

        const newUserId = result.insertId;

        // Automatically initialize an empty persistent cart for the user
        await db.query('INSERT INTO Cart (user_id) VALUES (?)', [newUserId]);

        res.status(201).json({
            message: 'User registered successfully!',
            user_id: newUserId
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user', details: error.message });
    }
};

// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        // Fetch user record
        const [users] = await db.query('SELECT * FROM User WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const user = users[0];

        // Verify password hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Sign JWT Token
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful!',
            token,
            user: {
                user_id: user.user_id,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to log in', details: error.message });
    }
};