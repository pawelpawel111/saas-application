import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';

const Reports = () => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Brak tokenu uwierzytelniającego.');
                }

                const response = await axios.get('/api/reports', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setReports(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) return <div>Ładowanie raportów...</div>;
    if (error) return <div style={{ color: 'red' }}>Błąd: {error}</div>;

    if (!reports) return <div>Brak danych do raportów.</div>;

    const salesChartData = {
        labels: reports.sales.map((sale) => sale.date),
        datasets: [
            {
                label: 'Sprzedaż',
                data: reports.sales.map((sale) => sale.amount),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    const usersChartData = {
        labels: ['Nowi użytkownicy', 'Aktywni użytkownicy'],
        datasets: [
            {
                label: 'Użytkownicy',
                data: [reports.users.new, reports.users.active],
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <h2>Raporty</h2>
            <div>
                <h3>Sprzedaż</h3>
                <Line data={salesChartData} />
            </div>
            <div>
                <h3>Użytkownicy</h3>
                <Bar data={usersChartData} />
            </div>
            {/* Dodaj inne raporty */}
        </div>
    );
};

export default Reports;