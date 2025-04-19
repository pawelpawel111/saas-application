import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterWorker() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        resetForm();
    }, []);

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Hasła muszą być takie same");
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/api/register/worker', { email, password });
            if (response.status !== 201) {
                throw new Error(response.data?.message || "Błąd rejestracji. Spróbuj ponownie.");
            }
            setMessage("Rejestracja zakończona sukcesem!");
            navigate('/login');
        } catch (error) {
            setMessage("Wystąpił błąd: " + error.message);
        } finally {
            resetForm();
        }
    };

    return (
        <div>
            <h2>Rejestracja pracownika</h2>
            <p>Wypełnij poniższy formularz, aby utworzyć konto pracownika.</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Hasło:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label>Potwierdź Hasło:</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <button type="submit">Zarejestruj</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default RegisterWorker;