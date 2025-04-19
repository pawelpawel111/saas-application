const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'saasuser',
    password: process.env.DB_PASS || '1234',
    database: process.env.DB_NAME || 'saas',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(() => {
        console.log('Połączono z bazą danych!');
    })
    .catch((err) => {
        console.error('Błąd połączenia z bazą danych:', err);
    });

module.exports = pool;