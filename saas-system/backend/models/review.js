// Review.js
const pool = require('../config/db');

const Review = {
    create: async (data) => {
        try {
            const [result] = await pool.query(
                'INSERT INTO reviews (user_id, service_id, rating, comment) VALUES (?, ?, ?, ?)',
                [data.user_id, data.service_id, data.rating, data.comment]
            );
            return result.insertId;
        } catch (error) {
            console.error('Błąd podczas dodawania recenzji:', error);
            throw error; // Przekazujemy błąd dalej, aby obsłużyć go w kontrolerze
        }
    },
    getAll: async () => {
        try {
            const [rows] = await pool.query('SELECT * FROM reviews');
            return rows;
        } catch (error) {
            console.error('Błąd podczas pobierania recenzji:', error);
            throw error;
        }
    },
    moderate: async (id, status) => {
        try {
            await pool.query('UPDATE reviews SET status = ? WHERE id = ?', [status, id]);
        } catch (error) {
            console.error('Błąd podczas moderowania recenzji:', error);
            throw error;
        }
    },
    // Dodaj inne metody (find by user, find by service, etc.)
};

module.exports = Review;