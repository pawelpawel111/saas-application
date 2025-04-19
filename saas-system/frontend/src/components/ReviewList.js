import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewList = ({ serviceId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Brak tokenu uwierzytelniającego.');
                }
                const response = await axios.get(`/api/reviews/${serviceId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReviews(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [serviceId]);

    if (loading) return <div>Ładowanie recenzji...</div>;
    if (error) return <div style={{ color: 'red' }}>Błąd: {error}</div>;

    return (
        <div>
            <h3>Recenzje</h3>
            {reviews.length > 0 ? (
                <ul>
                    {reviews.map((review) => (
                        <li key={review.id}>
                            Ocena: {review.rating}, Komentarz: {review.comment}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Brak recenzji.</p>
            )}
        </div>
    );
};

export default ReviewList;