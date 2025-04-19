// Payment.js
const pool = require('../config/db');

const Payment = {
  create: (data, callback) => {
    db.query(
      'INSERT INTO payments (appointment_id, amount, payment_date) VALUES (?, ?, ?)',
      [data.appointment_id, data.amount, data.payment_date],
      callback
    );
  },
  getHistory: (callback) => {
    db.query('SELECT * FROM payments', callback);
  },
  // Dodaj inne metody (find by appointment, find by user, etc.)
};

module.exports = Payment;