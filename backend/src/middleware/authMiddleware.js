const jwt = require('jsonwebtoken');

// Verify incoming JWT token in Authorization header
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Format expected: "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attaches { user_id, email, role } to req object
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

// Enforce Role-Based Access Control (RBAC)
exports.checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access forbidden: Insufficient permissions.' });
        }
        next();
    };
};