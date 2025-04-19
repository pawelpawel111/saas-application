import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Brak tokenu uwierzytelniającego.');
                }

                const response = await axios.get('/api/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) return <div>Ładowanie profilu...</div>;
    if (error) return <div style={{ color: 'red' }}>Błąd: {error}</div>;

    if (!user) return <div>Nie znaleziono profilu.</div>;

    return (
        <div>
            <h2>Profil użytkownika</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>Nazwa użytkownika: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Rola: {user.role}</p>
            {user.registrationDate && <p>Data rejestracji: {new Date(user.registrationDate).toLocaleDateString()}</p>}
            {/* Tutaj możesz dodać inne informacje o profilu */}
        </div>
    );
};

export default Profile;