const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware do ochrony tras
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Brak tokenu' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Nieautoryzowany' });
        }
        req.user = decoded; // Zapisujemy dane użytkownika w req
        next();
    });
};

// checkRole.js
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Brak dostępu' });
        }
        next();
    };
};

module.exports = {
    verifyToken,
    checkRole,
};