import React, { useState } from 'react';
import axios from 'axios';

const AddReview = ({ serviceId, userId, onReviewAdded }) => { // Dodaj props onReviewAdded
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Resetuj błąd przed wysłaniem żądania
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Brak tokenu uwierzytelniającego.');
            }
            if (rating < 1 || rating > 5) {
                throw new Error('Ocena musi być w zakresie od 1 do 5.');
            }
            if (!comment) {
                throw new Error('Komentarz nie może być pusty.');
            }

            await axios.post('/api/reviews', { serviceId, userId, rating, comment }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert('Recenzja dodana pomyślnie.');
            if (onReviewAdded) {
                onReviewAdded(); // Wywołaj funkcję odświeżającą listę recenzji
            }
            setComment(''); // Resetuj pole komentarza
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <label>Ocena:</label>
            <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} min="1" max="5" />
            <label>Komentarz:</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
            <button type="submit">Dodaj recenzję</button>
        </form>
    );
};

export default AddReview;