import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Brak tokenu uwierzytelniającego.');
                }

                const response = await axios.get('/api/payments', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setPayments(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const handlePayment = async (paymentId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Brak tokenu uwierzytelniającego.');
            }

            await axios.post(`/api/payments/${paymentId}/process`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert('Płatność zrealizowana pomyślnie.');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Ładowanie płatności...</div>;
    if (error) return <div style={{ color: 'red' }}>Błąd: {error}</div>;

    return (
        <div>
            <h2>Płatności</h2>
            {payments.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usługa</th>
                            <th>Kwota</th>
                            <th>Status</th>
                            <th>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment.id}>
                                <td>{payment.id}</td>
                                <td>{payment.service}</td>
                                <td>{payment.amount}</td>
                                <td>{payment.status}</td>
                                <td>
                                    {payment.status === 'oczekująca' && (
                                        <button onClick={() => handlePayment(payment.id)}>Zapłać</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Brak płatności.</p>
            )}
        </div>
    );
};

export default Payments;