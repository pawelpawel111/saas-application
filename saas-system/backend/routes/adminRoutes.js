const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/api/admin/users', adminController.getAllUsers);
router.post('/api/admin/users', adminController.addUser);
router.put('/api/admin/users/:id', adminController.updateUser);
router.delete('/api/admin/users/:id', adminController.deleteUser);

module.exports = router;