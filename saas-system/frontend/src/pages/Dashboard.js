import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { isAuthenticated, userRole } = useContext(AuthContext);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <h2>Dashboard</h2>

            {userRole === 'admin' && (
                <div>
                    <h3>Panel administracyjny</h3>
                    <div>
                        <h4>Zarządzanie</h4>
                        <ul>
                            <li><Link to="/admin/users">Użytkownicy</Link></li>
                            <li><Link to="/employees/list">Pracownicy</Link></li>
                            <li><Link to="/services/list">Usługi</Link></li>
                            <li><Link to="/reviews/list">Recenzje</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Rezerwacje</h4>
                        <ul>
                            <li><Link to="/calendar">Kalendarz wizyt</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Raporty i statystyki</h4>
                        <ul>
                            <li><Link to="/admin/stats">Statystyki</Link></li>
                            <li><Link to="/reports">Raporty</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Ustawienia</h4>
                        <ul>
                            <li><Link to="/admin/settings">Aplikacja</Link></li>
                            <li><Link to="/payments">Płatności</Link></li>
                        </ul>
                    </div>
                </div>
            )}

            {userRole === 'user' && (
                <div>
                    <h3>Panel pracownika</h3>
                    <div>
                        <h4>Rezerwacje</h4>
                        <ul>
                            <li><Link to="/calendar">Kalendarz wizyt</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Usługi</h4>
                        <ul>
                            <li><Link to="/services/list">Lista usług</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Recenzje</h4>
                        <ul>
                            <li><Link to="/reviews/add">Dodaj recenzję</Link></li>
                            <li><Link to="/reviews/list">Lista recenzji</Link></li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;