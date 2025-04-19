import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

const AdminPanel = () => {
    const isAuthenticated = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description, price }),
            });
            if (!response.ok) {
                throw new Error('Błąd dodawania usługi.');
            }
            // Opcjonalnie: odśwież listę usług lub pokaż komunikat o powodzeniu
        } catch (error) {
            console.error('Błąd dodawania usługi:', error);
            // Opcjonalnie: pokaż komunikat o błędzie
        }
    };

    if (!isAuthenticated || userRole !== 'admin') {
        return <Navigate to="/login" />; // Jeśli nie jest adminem, przekierowanie do logowania
    }

    return (
        <div>
            <h2>Panel Administracyjny</h2>
            <p>Witaj w panelu administratora!</p>

            {/* Formularz dodawania usługi */}
            <form onSubmit={handleSubmit}>
                <label>Nazwa:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <label>Opis:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                <label>Cena:</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                <button type="submit">Dodaj usługę</button>
            </form>
        </div>
    );
};

export default AdminPanel;