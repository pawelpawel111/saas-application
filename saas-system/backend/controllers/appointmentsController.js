// backend/controllers/appointmentsController.js
const pool = require('../config/db');

// Pobiera wszystkie rezerwacje, opcjonalnie filtrując po employeeId i dacie
exports.getAllAppointments = async (req, res) => {
  try {
    const { employeeId, date } = req.query;
    let query = 'SELECT * FROM bookings';
    const params = [];

    if (employeeId && date) {
      query += ' WHERE employee_id = ? AND DATE(booking_date) = ?';
      params.push(employeeId, date);
    } else if (employeeId) {
      query += ' WHERE employee_id = ?';
      params.push(employeeId);
    } else if (date) {
      query += ' WHERE DATE(booking_date) = ?';
      params.push(date);
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Błąd pobierania wizyt:", error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

// Tworzy nową rezerwację
exports.createAppointment = async (req, res) => {
  try {
    const { user_id, service_id, employee_id, booking_date } = req.body;

    // Podstawowa walidacja – upewnij się, że wszystkie pola są podane
    if (!user_id || !service_id || !employee_id || !booking_date) {
      return res.status(400).json({ message: 'Wszystkie pola są wymagane.' });
    }

    // Opcjonalnie dodaj walidację dostępności pracownika tutaj

    const [result] = await pool.query(
      'INSERT INTO bookings (user_id, service_id, employee_id, booking_date) VALUES (?, ?, ?, ?)',
      [user_id, service_id, employee_id, booking_date]
    );

    res.status(201).json({ message: 'Wizyta została dodana!', appointmentId: result.insertId });
  } catch (error) {
    console.error("Błąd tworzenia wizyty:", error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

// Aktualizuje wizytę – np. zmienia termin lub status
exports.updateAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { booking_date, status, employee_id } = req.body;

    // Przykładowa walidacja – przynajmniej booking_date musi być podana
    if (!booking_date) {
      return res.status(400).json({ message: 'Nowa data wizyty jest wymagana.' });
    }

    const [result] = await pool.query(
      'UPDATE bookings SET booking_date = ?, status = ?, employee_id = ? WHERE id = ?',
      [booking_date, status || 'pending', employee_id, appointmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Nie znaleziono wizyty.' });
    }

    res.json({ message: 'Wizyta zaktualizowana.' });
  } catch (error) {
    console.error("Błąd aktualizacji wizyty:", error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

// Usuwa wizytę
exports.deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [appointmentId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Nie znaleziono wizyty do usunięcia.' });
    }

    res.json({ message: 'Wizyta została usunięta.' });
  } catch (error) {
    console.error("Błąd usuwania wizyty:", error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};
