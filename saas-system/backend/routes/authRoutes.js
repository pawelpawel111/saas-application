const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const checkRole = require('../middleware/checkRole');
const verifyToken = require('../middleware/verifyToken');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/api/register', authController.register);
router.post('/register/admin', authController.registerAdmin);
router.post('/register/owner', authController.registerOwner);
router.post('/register/worker', authController.registerWorker);
router.post('/register/client', authController.registerClient);

router.post('/manage-users', verifyToken, checkRole(['admin']), (req, res) => {
    res.send('Zarządzanie użytkownikami');
});

router.get('/calendar', verifyToken, checkRole(['worker', 'admin']), (req, res) => {
    res.send('Przeglądanie kalendarza');
});

module.exports = router;