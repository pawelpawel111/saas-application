require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const appointmentsRoutes = require('./routes/appointmentsRoutes');
const bodyParser = require('body-parser');
const employeesRoutes = require('./routes/employeesRoutes');
const reviewsRouter = require('./routes/reviews');
const cookieParser = require('cookie-parser');
const eventsRoutes = require('./routes/events');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', employeesRoutes); // Używamy employeesRoutes
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/reviews', reviewsRouter);
app.use('/api/events', eventsRoutes);

// Middleware autoryzacyjny
const verifyToken = (req, res, next) => {
    console.log('Wywołano middleware verifyToken');
    const token = req.headers['authorization']?.split(' ')[1];
    console.log('Otrzymany token:', token);
    if (!token) {
        console.log('Brak tokenu w nagłówku.');
        return res.status(403).json({ message: 'Brak tokenu.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Błąd weryfikacji tokenu:', err);
            return res.status(401).json({ message: 'Nieautoryzowany.' });
        }
        req.user = decoded;
        console.log('Token zweryfikowany, użytkownik:', decoded);
        next();
    });
};

// Funkcja generująca token JWT
const generateToken = (user) => {
    console.log('Dane użytkownika do tokenu:', user);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(user, process.env.REFRESH_JWT_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

// Endpoint logowania
const login = async (req, res) => {
    // ... (kod logowania)
    const { accessToken, refreshToken } = generateToken(user);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.json({ accessToken });
};

// Endpoint odświeżania tokenu
app.post('/api/refresh-token', (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Brak odświeżającego tokenu.' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Nieprawidłowy odświeżający token.' });
        }
        const { accessToken, refreshToken: newRefreshToken } = generateToken(decoded);
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
        res.json({ accessToken });
    });
});

// Endpoint do pobierania listy usług
app.get('/api/services', verifyToken, async (req, res) => {
    console.log('Wywołano endpoint GET /api/services');
    try {
        const sql = "SELECT * FROM services";
        const [services] = await pool.query(sql);
        console.log('Dane z bazy danych (services):', services);
        res.json(services);
    } catch (error) {
        console.error("Błąd serwera (services):", error);
        res.status(500).json({ message: "Błąd serwera." });
    }
});

// Endpoint do pobierania listy wydarzeń
app.get('/api/events', verifyToken, async (req, res) => {
    console.log('Wywołano endpoint GET /api/events');
    try {
        const sql = "SELECT * FROM events";
        const [events] = await pool.query(sql);
        console.log('Dane z bazy danych (events):', events);
        res.json(events);
    } catch (error) {
        console.error("Błąd serwera (events):", error);
        res.status(500).json({ message: "Błąd serwera." });
    }
});

// Endpoint do aktualizacji wydarzenia
app.put('/api/events/:id', verifyToken, async (req, res) => {
    console.log('Wywołano endpoint PUT /api/events/:id');
    try {
        const { serviceId } = req.body;
        const { id } = req.params;

        // Sprawdź, czy wydarzenie istnieje
        const eventExistsQuery = 'SELECT * FROM events WHERE id = ?';
        const [eventExists] = await pool.query(eventExistsQuery, [id]);

        if (eventExists.length === 0) {
            return res.status(404).json({ message: 'Wydarzenie nie znalezione' });
        }

        const query = 'UPDATE events SET serviceId = ? WHERE id = ?';
        await pool.query(query, [serviceId, id]);

        res.status(200).json({ message: 'Wydarzenie zaktualizowane pomyślnie' });
    } catch (err) {
        console.error('Błąd podczas aktualizacji wydarzenia:', err);
        res.status(500).json({ message: 'Błąd serwera' });
    }
});

// Endpoint do usuwania wydarzenia
app.delete('/api/events/:id', verifyToken, async (req, res) => {
    console.log('Wywołano endpoint DELETE /api/events/:id');
    try {
        const { id } = req.params;

        // Sprawdź, czy wydarzenie istnieje
        const eventExistsQuery = 'SELECT * FROM events WHERE id = ?';
        const [eventExists] = await pool.query(eventExistsQuery, [id]);

        if (eventExists.length === 0) {
            return res.status(404).json({ message: 'Wydarzenie nie znalezione' });
        }

        const query = 'DELETE FROM events WHERE id = ?';
        await pool.query(query, [id]);

        res.status(200).json({ message: 'Wydarzenie usunięte pomyślnie' });
    } catch (err) {
        console.error('Błąd podczas usuwania wydarzenia:', err);
        res.status(500).json({ message: 'Błąd serwera' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
    console.log(`Endpointy API są dostępne.`);
});