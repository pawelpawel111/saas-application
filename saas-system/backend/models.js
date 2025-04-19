const mysql = require('mysql2');

// Konfiguracja połączenia z bazą danych
const pool = mysql.createPool({
    host: 'localhost',
    user: 'użytkownik',
    password: 'hasło',
    database: 'nazwa_bazy'
}).promise();

// Funkcja do pobierania recenzji
async function getReviews() {
    try {
        const [rows] = await pool.query('SELECT * FROM Reviews');
        return rows;
    } catch (error) {
        console.error('Błąd podczas pobierania recenzji:', error);
        throw error; // Przekazujemy błąd dalej, aby mógł być obsłużony w innym miejscu
    }
}

// Funkcja do dodawania recenzji
async function addReview(userId, serviceId, rating, comment) {
    try {
        const [result] = await pool.query(
            'INSERT INTO Reviews (userId, serviceId, rating, comment, date) VALUES (?, ?, ?, ?, NOW())',
            [userId, serviceId, rating, comment]
        );
        return result.insertId; // Zwracamy ID dodanej recenzji
    } catch (error) {
        console.error('Błąd podczas dodawania recenzji:', error);
        throw error;
    }
}

// Inne funkcje do operacji na bazie danych

module.exports = {
    pool,
    getReviews,
    addReview,
    // Eksport innych funkcji
};