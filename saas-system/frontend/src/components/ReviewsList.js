import React, { useEffect, useState } from 'react';

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/reviews')
      .then(response => response.json())
      .then(data => {
        setReviews(data);
        setError(null); // Resetowanie błędu, gdy dane zostały pomyślnie pobrane
      })
      .catch(err => {
        console.error('Błąd:', err);
        setError('Nie udało się załadować opinii. Spróbuj ponownie później.');
      });
  }, []);

  return (
    <div>
      <h3>Lista opinii</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {reviews.length > 0 ? (
          reviews.map(review => (
            <li key={review.id}>{review.content} - {review.client}</li>
          ))
        ) : (
          <p>Brak opinii do wyświetlenia.</p>
        )}
      </ul>
    </div>
  );
};

export default ReviewsList;
