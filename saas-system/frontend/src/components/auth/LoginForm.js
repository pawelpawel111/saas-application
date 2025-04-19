import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Próba logowania:", { email, password });

        try {
            const response = await axios.post('http://localhost:3000/api/login', {
                email,
                password,
            });

            if (response.status !== 200) {
                throw new Error('Błąd logowania. Spróbuj ponownie.');
            }

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role); // Upewnij się, że rola jest zapisywana
            localStorage.setItem('username', response.data.username);
            console.log("Token zapisany:", localStorage.getItem('token'));
            console.log("localStorage po zapisaniu tokenu:", localStorage);
            window.location.reload(); // Wymuszenie odświeżenia strony
            console.log("Przekierowanie do dashboard (reload)");
        } catch (err) {
            console.error("Błąd logowania:", err);
            setError(err.response?.data?.message || 'Błędne dane logowania. Spróbuj ponownie.');
        } finally {
            setEmail('');
            setPassword('');
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Logowanie</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Twój email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Hasło:</label>
                    <input
                        type="password"
                        placeholder="Twoje hasło"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Zaloguj się</button>
            </form>
        </div>
    );
};

export default LoginForm;