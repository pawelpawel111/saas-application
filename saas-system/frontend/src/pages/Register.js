import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        resetForm();
    }, []);

    const resetForm = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Hasła się nie zgadzają.');
            return;
        }

        try {
            console.log('Dane wysyłane do API:', { username, email, password });
            const response = await axios.post('http://localhost:3000/api/register', {
                username,
                email,
                password,
            });

            if (response.status !== 201) {
                throw new Error(response.data?.message || 'Wystąpił błąd przy rejestracji.');
            }

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
            console.log("Token:", localStorage.getItem('token'));
            console.log("Rola:", localStorage.getItem('role'));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Wystąpił błąd. Spróbuj ponownie później.');
        } finally {
            resetForm();
        }
    };

    return (
        <div style={styles.container}>
            <h2>Rejestracja</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Hasło:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Powtórz hasło:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" style={styles.button}>Zarejestruj się</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        textAlign: 'center',
        padding: '20px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        marginTop: '10px',
        cursor: 'pointer',
    },
};

export default Register;