// statsRoutes.js
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const Service = require('../models/Service');
const Employee = require('../models/Employee');

router.get('/stats', async (req, res) => {
    try {
        const serviceCount = await Service.countDocuments();
        const employeeCount = await Employee.countDocuments();
        res.json({ services: serviceCount, employees: employeeCount });
    } catch (err) {
        res.status(500).json({ message: 'Błąd serwera' });
    }
});

module.exports = router;