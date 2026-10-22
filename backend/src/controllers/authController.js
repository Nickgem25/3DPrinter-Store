const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Very simple "looks like an email" check: something@something.something
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/register
exports.register = async (req, res) => {
    // Express 5 leaves req.body undefined when no JSON is sent, so fall back to {}
    const { email, password, full_name, phone, address } = req.body || {};

    if (!email || !password || !full_name) {
        return res.status(400).json({ error: 'Email, password, and full name are required.' });
    }

    // Make sure these are really strings. If someone sends an object instead,
    // it could change how the SQL query behaves.
    if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    if (typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    try {
        // bcrypt creates a random "salt" and mixes it into the hash for us.
        // The 10 is the cost: higher = slower to crack, but also slower to log in.
        const password_hash = await bcrypt.hash(password, 10);

        // We no longer check "does this email exist?" first. The UNIQUE key on
        // user.email already guarantees it, and checking first has a gap:
        // two requests at the same moment could both pass the check.
        // Instead we try the INSERT and handle the duplicate error below.
        const [result] = await db.query(
            "INSERT INTO `user` (email, password_hash, full_name, phone, address, role) VALUES (?, ?, ?, ?, ?, 'customer')",
            [email.trim(), password_hash, String(full_name).trim(), phone || null, address || null]
        );

        const newUserId = result.insertId;

        // Every user gets one persistent cart (cart.user_id is UNIQUE)
        await db.query('INSERT INTO cart (user_id) VALUES (?)', [newUserId]);

        res.status(201).json({
            message: 'User registered successfully!',
            user_id: newUserId
        });
    } catch (error) {
        // ER_DUP_ENTRY = the UNIQUE constraint on email was violated
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email is already registered.' });
        }
        console.error('Register failed:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

// POST /api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body || {};

    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const [users] = await db.query('SELECT * FROM `user` WHERE email = ?', [email.trim()]);

        // Same message for "no such email" and "wrong password", so an attacker
        // can't use the login form to find out which emails are registered.
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // The token carries user_id and role, and expires after 24 hours.
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
        console.error('Login failed:', error);
        res.status(500).json({ error: 'Failed to log in' });
    }
};