// src/pages/AddData.js
import React, { useState } from 'react';
import axios from 'axios';

const AddData = () => {
  // Stan dla formularza rezerwacji
  const [userId, setUserId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Podstawowa walidacja
    if (!userId || !serviceId || !employeeId || !bookingDate) {
      setMessage('Wszystkie pola muszą być wypełnione.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/appointments', {
        user_id: userId,
        service_id: serviceId,
        employee_id: employeeId,
        booking_date: bookingDate, // np. "2024-05-01 10:00:00"
      });

      setMessage(response.data.message || 'Rezerwacja dodana!');
    } catch (err) {
      console.error(err);
      setMessage('Błąd przy dodawaniu rezerwacji.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Dodaj rezerwację (appointment)</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID:</label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Service ID:</label>
          <input
            type="number"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Employee ID:</label>
          <input
            type="number"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Booking Date (YYYY-MM-DD HH:MM:SS):</label>
          <input
            type="text"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Dodaj rezerwację</button>
      </form>
    </div>
  );
};

export default AddData;
