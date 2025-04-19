import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div style={styles.container}>
            {!isAuthenticated && (
                <div>
                    <h2>Witamy w aplikacji!</h2>
                    <p>Zarejestruj się lub zaloguj, aby kontynuować.</p>
                    <div style={styles.buttonContainer}>
                        <Link to="/login">
                            <button style={styles.button}>Zaloguj się</button>
                        </Link>
                        <Link to="/register">
                            <button style={styles.button}>Zarejestruj się</button>
                        </Link>
                    </div>
                </div>
            )}
            {isAuthenticated && (
                <div>
                    <h2>Strona główna</h2>
                    <p>Jesteś zalogowany.</p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        textAlign: 'center',
        padding: '20px',
    },
    buttonContainer: {
        marginTop: '20px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        margin: '10px',
        cursor: 'pointer',
    },
};

export default Home;