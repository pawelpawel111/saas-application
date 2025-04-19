import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminSettings = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Brak tokenu uwierzytelniającego.');
                }

                const response = await axios.get('/api/admin/settings', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setSettings(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSettingChange = (key, value) => {
        setSettings({ ...settings, [key]: value });
    };

    const handleSaveSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Brak tokenu uwierzytelniającego.');
            }

            await axios.post('/api/admin/settings', settings, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert('Ustawienia zapisane pomyślnie.');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Ładowanie ustawień...</div>;
    if (error) return <div style={{ color: 'red' }}>Błąd: {error}</div>;

    return (
        <div>
            <h2>Ustawienia aplikacji</h2>
            {Object.entries(settings).map(([key, value]) => (
                <div key={key}>
                    <label>{key}:</label>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleSettingChange(key, e.target.value)}
                    />
                </div>
            ))}
            <button onClick={handleSaveSettings}>Zapisz ustawienia</button>
        </div>
    );
};

export default AdminSettings;