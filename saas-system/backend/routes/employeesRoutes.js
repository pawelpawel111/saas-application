const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeesController');
const verifyToken = require('../middleware/verifyToken');

router.get('/employees', verifyToken, employeesController.getAllEmployees); // Poprawiony routing
router.post('/employees', verifyToken, employeesController.createEmployee);
router.put('/employees/:id', verifyToken, employeesController.updateEmployee);
router.delete('/employees/:id', verifyToken, employeesController.deleteEmployee);
router.post('/employees/bulk', verifyToken, employeesController.createMultipleEmployees);

module.exports = router;