// Service.js
const pool = require('../config/db');
const mongoose = require('mongoose');

const Service = {
  getAll: (callback) => {
    db.query('SELECT * FROM services', callback);
  },
  create: (data, callback) => {
    db.query(
      'INSERT INTO services (name, price, duration) VALUES (?, ?, ?)',
      [data.name, data.price, data.duration],
      callback
    );
  },
  update: (id, data, callback) => {
    db.query(
      'UPDATE services SET name = ?, price = ?, duration = ? WHERE id = ?',
      [data.name, data.price, data.duration, id],
      callback
    );
  },
  delete: (id, callback) => {
    db.query('DELETE FROM services WHERE id = ?', [id], callback);
  },
  // Dodaj inne metody (find by id, find by name, etc.)
};
const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

module.exports = mongoose.model('Service', serviceSchema);
