import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddService = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/api/services', {
                name,
                description,
                price,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.status === 201) {
                navigate('/services');
            } else {
                setError('Błąd podczas dodawania usługi.');
            }
        } catch (err) {
            console.error('Błąd dodawania usługi:', err);
            setError(err.response?.data?.message || 'Błąd podczas dodawania usługi.');
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Dodaj Usługę</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nazwa:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Opis:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div>
                    <label>Cena:</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <button type="submit">Dodaj</button>
            </form>
        </div>
    );
};

export default AddService;