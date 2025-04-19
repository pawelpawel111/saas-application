// src/pages/AddAppointment.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddAppointment = () => {
  const [userId, setUserId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !serviceId || !employeeId || !bookingDate) {
      setMessage('Wszystkie pola są wymagane.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/appointments', {
        user_id: userId,
        service_id: serviceId,
        employee_id: employeeId,
        booking_date: bookingDate, // np. "2024-05-01 10:00:00"
      });

      setMessage(response.data.message || 'Wizyta została dodana!');
      // Po dodaniu wizyty możesz przekierować do dashboardu, lub odświeżyć listę wizyt:
      navigate('/dashboard');
    } catch (error) {
      console.error('Błąd przy dodawaniu wizyty:', error);
      setMessage('Błąd serwera przy dodawaniu wizyty.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Dodaj nową wizytę</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID Klienta:</label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>ID Usługi:</label>
          <input
            type="number"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>ID Pracownika:</label>
          <input
            type="number"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Data i czas wizyty (YYYY-MM-DD HH:MM:SS):</label>
          <input
            type="text"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Dodaj wizytę</button>
      </form>
    </div>
  );
};

export default AddAppointment;
