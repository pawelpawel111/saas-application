// backend/routes/appointmentsRoutes.js
const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');

// Pobiera wszystkie wizyty (opcjonalnie z filtracją)
router.get('/', appointmentsController.getAllAppointments);

// Dodaje nową wizytę
router.post('/', appointmentsController.createAppointment);

// Aktualizuje wizytę
router.put('/:id', appointmentsController.updateAppointment);

// Usuwa wizytę
router.delete('/:id', appointmentsController.deleteAppointment);

module.exports = router;
