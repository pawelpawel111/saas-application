// backend/middleware/checkRole.js
const checkRole = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403).json({ message: 'Brak uprawnień.' });
        }
    };
};

module.exports = checkRole;