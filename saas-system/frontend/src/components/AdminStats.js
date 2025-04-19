import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const AdminStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Brak tokenu uwierzytelniającego.');
                }

                const response = await axios.get('/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setStats(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Ładowanie statystyk...</div>;
    if (error) return <div style={{ color: 'red' }}>Błąd: {error}</div>;

    if (!stats) return <div>Brak danych statystycznych.</div>;

    const chartData = {
        labels: stats.sales.map((sale) => sale.date),
        datasets: [
            {
                label: 'Sprzedaż',
                data: stats.sales.map((sale) => sale.amount),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    return (
        <div>
            <h2>Statystyki i raporty</h2>
            <div>
                <h3>Sprzedaż</h3>
                <Line data={chartData} />
            </div>
            <div>
                <h3>Liczba użytkowników</h3>
                <p>Łącznie: {stats.users.total}</p>
                <p>Nowi użytkownicy (ostatni miesiąc): {stats.users.new}</p>
            </div>
            {/* Dodaj inne statystyki i raporty */}
        </div>
    );
};

export default AdminStats;