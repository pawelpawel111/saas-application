import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importujemy useNavigate

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Inicjujemy useNavigate

  // Funkcja obsługująca wysyłanie formularza
  const handleSubmit = async (e) => {
    e.preventDefault();  // Zapobiega domyślnej akcji (przeładowanie strony)

    // Sprawdź, czy email i hasło nie są puste
    if (!email || !password) {
      setError('Proszę wypełnić wszystkie pola.');
      return;
    }

    try {
      // Wyślij zapytanie POST do backendu
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        // Obsłuż błąd w przypadku nieudanego logowania
        const data = await response.json();
        setError(data.message || 'Błąd logowania');
      } else {
        // Jeżeli logowanie jest udane, możesz przekierować użytkownika
        alert('Zalogowano pomyślnie');
        navigate('/dashboard'); // Przekierowanie na stronę dashboard po zalogowaniu
      }
    } catch (error) {
      setError('Wystąpił błąd połączenia.');
    }
  };

  return (
    <div>
      <h2>Logowanie</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Hasło</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Zaloguj</button>
      </form>
    </div>
  );
};

export default LoginForm;
