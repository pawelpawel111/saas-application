import React, { useState } from 'react';
import axios from 'axios';

function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // Komunikat dla użytkownika
  const [isSubmitting, setIsSubmitting] = useState(false); // Stan ładowania

  const handleSubmit = (e) => {
    e.preventDefault();

    // Sprawdzenie, czy email jest poprawny
    if (!email) {
      setMessage("Proszę podać adres e-mail.");
      return;
    }

    setIsSubmitting(true); // Rozpoczynamy wysyłanie danych

    // Wysyłanie żądania do backendu (przykład z axios)
    axios.post('http://localhost:3000/api/auth/reset-password', { email })
      .then(res => {
        setMessage(res.data.message || "Instrukcje resetowania hasła zostały wysłane na Twój adres e-mail.");
      })
      .catch(err => {
        if (err.response) {
          setMessage(err.response.data.message || "Błąd przy próbie resetowania hasła.");
        } else {
          setMessage("Błąd połączenia z serwerem.");
        }
      })
      .finally(() => {
        setIsSubmitting(false); // Kończymy wysyłanie danych
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Resetowanie Hasła</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Wysyłanie...' : 'Zresetuj Hasło'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default ResetPasswordForm;
