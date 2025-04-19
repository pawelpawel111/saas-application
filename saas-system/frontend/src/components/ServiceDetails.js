import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReviewList from './ReviewList';
import AddReview from './AddReview';

const ServiceDetails = () => {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Brak tokenu uwierzytelniającego.');
                }
                const response = await axios.get(`/api/services/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setService(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchServiceDetails();
    }, [id]);

    if (loading) return <div>Ładowanie szczegółów usługi...</div>;
    if (error) return <div style={{ color: 'red' }}>Błąd: {error}</div>;

    if (!service) return <div>Usługa nie znaleziona.</div>;

    return (
        <div>
            <h2>{service.name}</h2>
            <p>{service.description}</p>
            <p>Cena: {service.price} zł</p>
            <ReviewList serviceId={id} />
            <AddReview serviceId={id} userId={localStorage.getItem('userId')} />
        </div>
    );
};

export default ServiceDetails;