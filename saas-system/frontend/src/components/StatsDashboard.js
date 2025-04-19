import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StatsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true); // Dodanie stanu ładowania
  const [error, setError] = useState(null); // Dodanie stanu błędu
  const navigate = useNavigate(); // Hook do nawigacji

  useEffect(() => {
    fetch('http://localhost:3000/api/stats', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
})
      .then(data => {
        setStats(data);
        setLoading(false); // Zmiana stanu na zakończone ładowanie
      })
      .catch(err => {
        setError(err.message); // Ustawienie błędu, jeśli wystąpi
        setLoading(false); // Zakończenie ładowania
        console.error('Błąd:', err);
      });
  }, [navigate]); // Dodanie 'navigate' do zależności

  if (loading) {
    return <p>Ładowanie statystyk...</p>; // Informacja o ładowaniu
  }

  if (error) {
    return <p>Błąd: {error}</p>; // Informacja o błędzie
  }

  return (
    <div>
      <h3>Statystyki</h3>
      {stats ? (
        <div>
          <p>Łączna liczba usług: {stats.services}</p>
          <p>Łączna liczba pracowników: {stats.employees}</p>
          <p>Łączna liczba spotkań: {stats.appointments}</p>
        </div>
      ) : (
        <p>Brak danych.</p> // Obsługa przypadku braku danych
      )}
    </div>
  );
};

export default StatsDashboard;
