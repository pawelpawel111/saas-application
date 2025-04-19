import React, { useState, useEffect } from 'react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Brak tokenu.');
                }

                const response = await fetch('http://localhost:3000/api/profile', { // Zmień na swój endpoint
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Nie udało się pobrać profilu.');
                }

                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []); // Dodano pustą tablicę zależności

    if (loading) {
        return <p>Ładowanie profilu...</p>;
    }

    if (error) {
        return <p>Błąd: {error}</p>;
    }

    if (!user) {
        return <p>Brak danych profilu.</p>;
    }

    return (
        <div>
            <h2>Profil użytkownika</h2>
            <p>Nazwa użytkownika: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Rola: {user.role}</p>
            {/* Dodaj więcej informacji o profilu */}
        </div>
    );
};

export default Profile;