import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServicesList = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState(null);

    const fetchServices = async () => {
        setLoading(true); // Ustaw ładowanie na true przed pobraniem danych
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Brak tokenu uwierzytelniającego.');
            }
            const response = await axios.get('/api/services', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setServices(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        if (!name || !description || !price) {
            setError('Wszystkie pola są wymagane.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Brak tokenu uwierzytelniającego.');
            }
            await axios.post('/api/services', { name, description, price }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage('Usługa dodana pomyślnie.');
            setName('');
            setDescription('');
            setPrice('');
            fetchServices(); // Wywołaj fetchServices po dodaniu usługi, aby zaktualizować listę
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Ładowanie...</div>;
    if (error) return <div style={{ color: 'red' }}>Wystąpił błąd: {error}</div>;

    return (
        <div>
            <h2>Lista Usług</h2>
            <form onSubmit={handleSubmit}>
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <label>Nazwa:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <label>Opis:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                <label>Cena:</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                <button type="submit">Dodaj usługę</button>
            </form>

            {services.length > 0 ? (
                <ul>
                    {services.map(({ id, name, description, price }) => (
                        <li key={id}>
                            {name} - {description} - {price} zł
                        </li>
                    ))}
                </ul>
            ) : (
                <div>Brak usług do wyświetlenia.</div>
            )}
        </div>
    );
};

export default ServicesList;