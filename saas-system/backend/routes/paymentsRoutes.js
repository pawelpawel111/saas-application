// paymentsRoutes.js
const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');

router.post('/', paymentsController.processPayment);
router.get('/history', paymentsController.getPaymentHistory);

module.exports = router;