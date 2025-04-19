import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import './styles/styles.css';

Modal.setAppElement('#root');

const EmployeesList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);

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

    const openModal = (employee, addMode = false) => {
        setSelectedEmployee(employee ? { ...employee } : {
            name: '',
            surname: '',
            position: '',
            email: '',
            phone: ''
        });
        setIsAddMode(addMode);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedEmployee(null);
        setModalIsOpen(false);
        setIsAddMode(false);
    };

    const handleEditEmployee = (employee) => {
        openModal(employee);
    };

    const handleAddEmployee = () => {
        openModal(null, true);
    };

    const handleDeleteEmployee = (employee) => {
        setSelectedEmployee(employee);
        setConfirmationDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedEmployee) return;
        try {
            await axios.delete(`/api/employees/${selectedEmployee.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                baseURL: 'http://localhost:3000',
            });
            setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== selectedEmployee.id));
            setError(null);
        } catch (err) {
            console.error('Błąd podczas usuwania pracownika:', err);
            setError(err.message);
        }
        setConfirmationDialogOpen(false);
        closeModal();
    };

    const handleSaveEmployee = async () => {
        if (!selectedEmployee) return;
        try {
            console.log('Frontend: Dane wysyłane do serwera:', selectedEmployee);

            if (isAddMode) {
                console.log('Frontend: Wykonywanie żądania POST...');
                const response = await axios.post('/api/employees', selectedEmployee, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    baseURL: 'http://localhost:3000',
                });
                console.log('Frontend: Odpowiedź z serwera (POST):', response);
                // Pobierz id z odpowiedzi serwera
                const newEmployeeId = response.data.id;
                // Aktualizuj stan employees z id
                setEmployees(prevEmployees => [...prevEmployees, { ...selectedEmployee, id: newEmployeeId }]);
            } else {
                console.log('Frontend: Wykonywanie żądania PUT...');
                const response = await axios.put(`/api/employees/${selectedEmployee.id}`, selectedEmployee, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    baseURL: 'http://localhost:3000',
                });
                console.log('Frontend: Odpowiedź z serwera (PUT):', response);
                setEmployees(prevEmployees => prevEmployees.map(emp =>
                    emp.id === selectedEmployee.id ? selectedEmployee : emp
                ));
            }
            setError(null);
            setSelectedEmployee(selectedEmployee);
        } catch (err) {
            console.error('Frontend: Błąd podczas zapisywania pracownika:', err);
            console.error('Frontend: Szczegóły błędu:', err.response);
            if (err.response && err.response.data) {
                console.error('Frontend: Dane błędu z serwera:', err.response.data);
            }
            setError(err.message);
        }
        closeModal();
    };

    const ConfirmationDialog = ({ onConfirm, onCancel }) => {
        return (
            <div className="dialog">
                <h2>Czy na pewno chcesz usunąć tego pracownika?</h2>
                <div className="button-group">
                    <button onClick={onConfirm} className="btn-delete">Tak</button>
                    <button onClick={onCancel} className="btn-cancel">Nie</button>
                </div>
            </div>
        );
    };

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

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Lista pracowników</h3>
                <button onClick={handleAddEmployee} className="btn-save">Dodaj pracownika</button>
            </div>

            {employees.length > 0 ? (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imię</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nazwisko</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specjalizacja</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcje</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {employees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-gray-600">{employee.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-gray-600">{employee.surname}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-gray-600">{employee.position}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{employee.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{employee.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => handleEditEmployee(employee)} className="btn-save">Edytuj</button>
                                        <button onClick={() => handleDeleteEmployee(employee)} className="btn-delete">Usuń</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">Brak pracowników do wyświetlenia.</p>
                </div>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="custom-modal"
                contentLabel={isAddMode ? "Dodaj pracownika" : "Edytuj pracownika"}
            >
                {selectedEmployee && (
                    <div className="dialog">
                        <h2>{isAddMode ? "Dodaj pracownika" : "Edytuj pracownika"}</h2>
                        <input
                            type="text"
                            value={selectedEmployee.name}
                            onChange={(e) => {
                                setSelectedEmployee({ ...selectedEmployee, name: e.target.value });
                                console.log(selectedEmployee);
                            }}
                            placeholder="Imię"
                        />
                        <input
                            type="text"
                            value={selectedEmployee.surname}
                            onChange={(e) => {
                                setSelectedEmployee({ ...selectedEmployee, surname: e.target.value });
                                console.log(selectedEmployee);
                            }}
                            placeholder="Nazwisko"
                        />
                        <input
                            type="text"
                            value={selectedEmployee.position}
                            onChange={(e) => {
                                setSelectedEmployee({ ...selectedEmployee, position: e.target.value });
                                console.log(selectedEmployee);
                            }}
                            placeholder="Specjalizacja"
                        />
                        <input
                            type="email"
                            value={selectedEmployee.email}
                            onChange={(e) => {
                                setSelectedEmployee({ ...selectedEmployee, email: e.target.value });
                                console.log(selectedEmployee);
                            }}
                            placeholder="Email"
                        />
                        <input
                            type="tel"
                            value={selectedEmployee.phone}
                            onChange={(e) => {
                                setSelectedEmployee({ ...selectedEmployee, phone: e.target.value });
                                console.log(selectedEmployee);
                            }}
                            placeholder="Telefon"
                        />
                        <div className="button-group">
                            <button onClick={handleSaveEmployee} className="btn-save">Zapisz</button>
                            <button onClick={closeModal} className="btn-cancel">Anuluj</button>
                        </div>
                    </div>
                )}
            </Modal>

            {confirmationDialogOpen && (
                <ConfirmationDialog
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setConfirmationDialogOpen(false)}
                />
            )}
        </div>
    );
};

export default EmployeesList;