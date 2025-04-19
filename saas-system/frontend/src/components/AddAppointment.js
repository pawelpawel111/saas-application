import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddAppointment = () => {
    const [services, setServices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [serviceId, setServiceId] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchServicesAndEmployees = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Brak tokenu uwierzytelniającego.');
                }

                const servicesResponse = await axios.get('/api/services', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const employeesResponse = await axios.get('/api/employees', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setServices(servicesResponse.data);
                setEmployees(employeesResponse.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchServicesAndEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (!serviceId || !employeeId || !date) {
            setError('Wszystkie pola są wymagane.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Brak tokenu uwierzytelniającego.');
            }

            await axios.post('/api/appointments', {
                serviceId,
                employeeId,
                date: date.toISOString(), // Formatowanie daty do ISO string
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMessage('Wizyta dodana pomyślnie.');
            setServiceId('');
            setEmployeeId('');
            setDate(new Date());
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Ładowanie danych...</div>;
    if (error) return <div style={{ color: 'red' }}>Błąd: {error}</div>;

    return (
        <div>
            <h2>Dodaj wizytę</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Usługa:
                    <select value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
                        <option value="">Wybierz usługę</option>
                        {services.map((service) => (
                            <option key={service.id} value={service.id}>
                                {service.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Pracownik:
                    <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
                        <option value="">Wybierz pracownika</option>
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Data:
                    <DatePicker selected={date} onChange={(date) => setDate(date)} />
                </label>
                <button type="submit">Dodaj wizytę</button>
            </form>
        </div>
    );
};

export default AddAppointment;