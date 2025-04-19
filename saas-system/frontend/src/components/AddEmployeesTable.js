import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UniversalTable from './UniversalTable'; // Upewnij się, że ścieżka jest poprawna

const AddEmployeesTable = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (!role || (role !== 'admin' && role !== 'superadmin')) {
            navigate('/login');
            return;
        }

        const fetchEmployees = async () => {
            try {
                console.log('Frontend: Rozpoczęto pobieranie pracowników...');
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('Frontend: Brak tokenu uwierzytelniającego.');
                    throw new Error('Brak tokenu uwierzytelniającego.');
                }

                const response = await axios.get('/api/employees', {
                    headers: { Authorization: `Bearer ${token}` },
                    baseURL: 'http://localhost:3000',
                });

                console.log('Frontend: Pobrano pracowników pomyślnie:', response.data);
                setEmployees(response.data);
                setError(null);
            } catch (err) {
                console.error('Frontend: Błąd pobierania pracowników:', err);
                console.error('Frontend: Ślad stosu:', err.stack);
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Wystąpił błąd podczas pobierania listy pracowników.'
                );
            } finally {
                console.log('Frontend: Pobieranie pracowników zakończone.');
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <span className="ml-2 text-gray-600">Ładowanie...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
                <div className="flex items-center text-red-700">
                    <span>Błąd: {error}</span>
                </div>
            </div>
        );
    }

    const headers = ['Imię i nazwisko', 'Specjalizacja', 'Email', 'Telefon'];

    const renderRow = (employee) => (
        <>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{employee.first_name} {employee.last_name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-gray-600">{employee.specialization}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{employee.email}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{employee.phone}</div>
            </td>
        </>
    );

    return (
        <div className="p-6">
            <div className="flex items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Lista pracowników</h3>
            </div>

            {employees.length > 0 ? (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <UniversalTable headers={headers} data={employees} renderRow={renderRow} />
                </div>
            ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">Brak pracowników do wyświetlenia.</p>
                </div>
            )}
        </div>
    );
};

export default AddEmployeesTable;