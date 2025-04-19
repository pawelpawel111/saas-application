import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Brak tokenu uwierzytelniającego.');
                }

                const response = await axios.get('/api/admin/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUsers(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Brak tokenu uwierzytelniającego.');
            }

            await axios.delete(`/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUsers(users.filter((user) => user.id !== userId));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Ładowanie użytkowników...</div>;
    if (error) return <div style={{ color: 'red' }}>Błąd: {error}</div>;

    return (
        <div>
            <h2>Zarządzanie użytkownikami</h2>
            {users.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nazwa użytkownika</th>
                            <th>Email</th>
                            <th>Rola</th>
                            <th>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button onClick={() => handleDeleteUser(user.id)}>Usuń</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Brak użytkowników.</p>
            )}
        </div>
    );
};

export default AdminUsers;