const jwt = require('jsonwebtoken');

// Verify the JWT sent in the Authorization header.
// Expected format:  Authorization: Bearer <token>
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { user_id, email, role } - available to every later handler
        next();
    } catch (error) {
        // 401 = "we don't know who you are" (bad or expired token).
        // 403 is kept for "we know who you are, but you're not allowed".
        // A frontend can use 401 to send the user back to the login page.
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

// Role-Based Access Control: only let through users whose role is in the list.
// Usage in a route:  checkRole(['admin'])
exports.checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access forbidden: Insufficient permissions.' });
        }
        next();
    };
};