const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../database'); // Zakładając, że masz folder 'database' do połączeń z DB
const router = express.Router();

// Rejestracja Super Admina
router.post('/superadmin/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Sprawdzamy, czy użytkownik już istnieje
  const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (existingUser.length > 0) {
    return res.status(400).json({ message: 'Użytkownik o tym emailu już istnieje' });
  }

  // Hashowanie hasła
  const hashedPassword = await bcrypt.hash(password, 10);

  // Tworzenie nowego Super Admina
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, 'superadmin'] // Przypisanie roli superadmin
  );

  res.status(201).json({ message: 'Super Administrator został zarejestrowany', userId: result.insertId });
});

// Rejestracja właściciela salonu przez Super Admina
router.post('/superadmin/register-owner', async (req, res) => {
  const { username, email, password, salonName } = req.body;

  // Sprawdzamy, czy właściciel już istnieje
  const [existingOwner] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (existingOwner.length > 0) {
    return res.status(400).json({ message: 'Właściciel salonu o tym emailu już istnieje' });
  }

  // Hashowanie hasła
  const hashedPassword = await bcrypt.hash(password, 10);

  // Tworzenie właściciela salonu
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password, role, salon_name) VALUES (?, ?, ?, ?, ?)',
    [username, email, hashedPassword, 'owner', salonName]
  );

  res.status(201).json({ message: 'Właściciel salonu został zarejestrowany', ownerId: result.insertId });
});

// Rejestracja pracownika przez właściciela salonu
router.post('/owner/register-worker', async (req, res) => {
  const { username, email, password, ownerId } = req.body;

  // Sprawdzamy, czy pracownik już istnieje
  const [existingWorker] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (existingWorker.length > 0) {
    return res.status(400).json({ message: 'Pracownik o tym emailu już istnieje' });
  }

  // Hashowanie hasła
  const hashedPassword = await bcrypt.hash(password, 10);

  // Tworzenie nowego pracownika
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password, role, owner_id) VALUES (?, ?, ?, ?, ?)',
    [username, email, hashedPassword, 'worker', ownerId]
  );

  res.status(201).json({ message: 'Pracownik został zarejestrowany', workerId: result.insertId });
});



module.exports = router;
