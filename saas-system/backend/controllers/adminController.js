const pool = require('../config/db');

const adminController = {
  getAllUsers: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM users');
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
  addUser: async (req, res) => {
    const { username, password, role } = req.body;
    try {
      const [result] = await pool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role]);
      res.status(201).json({ id: result.insertId, username, role });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
  updateUser: async (req, res) => {
    const { username, password, role } = req.body;
    try {
      await pool.query('UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?', [username, password, role, req.params.id]);
      res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = adminController;