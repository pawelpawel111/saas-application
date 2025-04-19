// Appointment.js
const pool = require('../config/db');

const Appointment = {
  getAll: (callback) => {
    db.query('SELECT * FROM appointments', callback);
  },
  create: (data, callback) => {
    db.query(
      'INSERT INTO appointments (user_id, employee_id, service_id, appointment_date) VALUES (?, ?, ?, ?)',
      [data.user_id, data.employee_id, data.service_id, data.appointment_date],
      callback
    );
  },
  update: (id, data, callback) => {
    db.query(
      'UPDATE appointments SET user_id = ?, employee_id = ?, service_id = ?, appointment_date = ? WHERE id = ?',
      [data.user_id, data.employee_id, data.service_id, data.appointment_date, id],
      callback
    );
  },
  delete: (id, callback) => {
    db.query('DELETE FROM appointments WHERE id = ?', [id], callback);
  },
  // Dodaj inne metody (find by id, find by user, etc.)
};

module.exports = Appointment;