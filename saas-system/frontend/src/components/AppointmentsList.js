import React, { useEffect, useState } from 'react';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true); // Stan ładowania
  const [error, setError] = useState(null); // Stan błędów

  useEffect(() => {
    fetch('http://localhost:3000/api/appointments')
      .then(response => {
        if (!response.ok) {
          throw new Error('Nie udało się pobrać danych');
        }
        return response.json();
      })
      .then(data => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Ładowanie...</p>;
  }

  return (
    <div>
      <h3>Lista spotkań</h3>
      {error && <p style={{ color: 'red' }}>Błąd: {error}</p>}
      {appointments.length === 0 ? (
        <p>Brak spotkań do wyświetlenia.</p>
      ) : (
        <ul>
          {appointments.map(appointment => (
            <li key={appointment.id}>
              {appointment.date} - {appointment.client}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppointmentsList;
