import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setEmail('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!username || !email || !password) {
            setMessage("Wszystkie pola są wymagane!");
            return;
        }

        setIsSubmitting(true);

        axios.post('http://localhost:3000/api/register', { username, password, email })
            .then(res => {
                if (res.status !== 201) {
                    throw new Error(res.data?.message || "Błąd rejestracji.");
                }

                const { token, username, role } = res.data;
                localStorage.setItem('token', token);
                setMessage("Rejestracja udana! Zaloguj się.");
                resetForm();
            })
            .catch(err => {
                setMessage(err.response?.data?.message || "Błąd połączenia z serwerem.");
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nazwa użytkownika:</label>
                <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Hasło:</label>
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Przesyłanie...' : 'Zarejestruj się'}
            </button>
            {message && <p>{message}</p>}
        </form>
    );
}

export default RegisterForm;