const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Wszystkie pola są wymagane.', error: 'Missing email or password' });
        }

        const [user] = await pool.query(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [email, email]
        );

        if (user.length === 0) {
            console.log('Użytkownik nie znaleziony');
            return res.status(401).json({ message: 'Nieprawidłowy e-mail lub hasło.', error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) {
            console.log('Błędne hasło');
            return res.status(401).json({ message: 'Nieprawidłowy e-mail lub hasło.', error: 'Invalid password' });
        }

        console.log("Rola uzytkownika z bazy:", user[0].role);
        const token = generateToken(user[0]);
        console.log('Zalogowany użytkownik:', user[0]);

        res.json({ token, username: user[0].username, role: user[0].role });
    } catch (err) {
        console.error('Błąd serwera:', err);
        res.status(500).json({ message: 'Błąd serwera, spróbuj ponownie.', error: err.message });
    }
};

const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ message: 'Wszystkie pola muszą być wypełnione.', error: 'Missing username, password or email' });
        }

        const [existingUsers] = await pool.query('SELECT * FROM users');
        const isAdmin = existingUsers.length === 0 ? 'admin' : 'user';

        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Użytkownik o tej nazwie już istnieje.', error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            'INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, isAdmin, email]
        );

        const newUser = { id: result.insertId, username, role: isAdmin };
        const token = generateToken(newUser);
        console.log("Rola nowo zarejestrowanego uzytkownika:", isAdmin);
        res.status(201).json({ token, username, role: isAdmin });
    } catch (err) {
        console.error('Błąd rejestracji:', err);
        res.status(500).json({ message: 'Błąd serwera, spróbuj ponownie później.', error: err.message });
    }
};

const registerRole = async (req, res, role) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ message: 'Wszystkie pola muszą być wypełnione.', error: 'Missing username, password or email' });
        }

        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Użytkownik o tej nazwie już istnieje.', error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            'INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, role, email]
        );

        const newUser = { id: result.insertId, username, role };
        const token = generateToken(newUser);
        console.log("Rola rejestracji z funkcji registerRole:", role);
        res.status(201).json({ token, username, role });
    } catch (err) {
        console.error('Błąd rejestracji:', err);
        res.status(500).json({ message: 'Błąd serwera, spróbuj ponownie później.', error: err.message });
    }
};

const registerAdmin = async (req, res) => registerRole(req, res, 'admin');
const registerOwner = async (req, res) => registerRole(req, res, 'owner');
const registerWorker = async (req, res) => registerRole(req, res, 'worker');
const registerClient = async (req, res) => registerRole(req, res, 'user');

module.exports = { login, register, registerAdmin, registerOwner, registerWorker, registerClient };