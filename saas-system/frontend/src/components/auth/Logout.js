import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setAuth }) => { // Dodaj props setAuth
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("Logout: handleLogout");
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('username');
            setAuth(false); // Aktualizuj stan uwierzytelnienia w komponencie nadrzędnym
            navigate('/login'); // Zmień przekierowanie na stronę logowania
        } catch (error) {
            console.error('Błąd wylogowania:', error);
            alert('Wystąpił błąd podczas wylogowywania.'); // Wyświetl komunikat o błędzie
        }
    };

    return (
        <button onClick={handleLogout}>Wyloguj się</button>
    );
};

export default Logout;