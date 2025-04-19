// routes/events.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM events');
        res.json(rows);
    } catch (error) {
        console.error('Błąd pobierania wydarzeń:', error);
        res.status(500).json({ message: 'Błąd serwera.' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const { serviceId, start, end } = req.body;
        await pool.query('INSERT INTO events (serviceId, start, end) VALUES (?, ?, ?)', [serviceId, start, end]);
        res.status(201).json({ message: 'Wydarzenie dodane pomyślnie.' });
    } catch (error) {
        console.error('Błąd dodawania wydarzenia:', error);
        res.status(500).json({ message: 'Błąd serwera.' });
    }
});

module.exports = router;