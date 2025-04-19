import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navigation = () => {
    const { isAuthenticated, userRole, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav>
            <div className="logo">Twoje Logo</div>
            <div className="social-icons">
                <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                {!isAuthenticated && (
                    <>
                        <Link to="/login" className="auth-link">Zaloguj się</Link>
                        <Link to="/register" className="auth-link">Zarejestruj się</Link>
                    </>
                )}
                {isAuthenticated && (
                    <>
                        {userRole === 'admin' && (
                            <>
                                <Link to="/admin" className="admin-link">Panel Admina</Link>
                                <Link to="/employees/list" className="admin-link">Lista pracowników</Link>
                                <Link to="/services/add" className="admin-link">Dodaj usługę</Link>
                                <Link to="/services/list" className="admin-link">Lista usług</Link>
                            </>
                        )}
                        <Link to="/profile" className="profile-link">Profil</Link>
                        <button onClick={handleLogout} className="logout-button">Wyloguj się</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navigation;