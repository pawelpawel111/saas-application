import React, { useState, useEffect, useReducer } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './styles/style.css';

// Komponenty auth
import LoginForm from './components/auth/LoginForm';
import Register from './pages/Register';
import RegisterAdmin from './components/auth/RegisterAdmin';
import RegisterOwner from './components/auth/RegisterOwner';
import RegisterWorker from './components/auth/RegisterWorker';
import RegisterClient from './components/auth/RegisterClient';
import Logout from './components/auth/Logout';
import AddService from './components/AddService';
import ServicesList from './components/ServicesList';
import AddEmployeesTable from './components/AddEmployeesTable';

// Inne strony
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AddAppointment from './pages/AddAppointment';

// Dodatkowe komponenty
import AddEmployee from './components/AddEmployee';
import EmployeesList from './components/EmployeesList';
import MyCalendar from './components/Calendar/calendar';

// Import dla Navigation i AdminPanel
import AdminPanel from './components/AdminPanel';
import Layout from './components/layouts/Layout';

// Przykładowy komponent UsersManagement
const UsersManagement = () => {};

// Przykładowy komponent Settings
const Settings = () => {};

// Przykładowy komponent Stats
const Stats = () => {};

const App = () => {
    const [auth, setAuth] = useState(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(localStorage.getItem('role'));
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const isAuthenticated = !!token;
        setAuth(isAuthenticated);
        forceUpdate();
        console.log('App.js location changed', location);
        console.log('App.js useEffect token:', token);
    }, [location]);

    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);
        console.log('App.js useEffect userRole updated:', role);
    }, [localStorage.getItem('role')]);

    console.log('App.js isAuthenticated:', auth);
    console.log('App.js userRole:', userRole);
    console.log('App.js warunek renderowania ServicesList:', auth && userRole === 'admin');

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!auth ? <LoginForm /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!auth ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/register/admin" element={!auth ? <RegisterAdmin /> : <Navigate to="/dashboard" />} />
            <Route path="/register/owner" element={!auth ? <RegisterOwner /> : <Navigate to="/dashboard" />} />
            <Route path="/register/worker" element={!auth ? <RegisterWorker /> : <Navigate to="/dashboard" />} />
            <Route path="/register/client" element={!auth ? <RegisterClient /> : <Navigate to="/dashboard" />} />
            <Route element={<Layout />}>
                <Route path="/dashboard" element={auth ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/admin" element={auth && userRole === 'admin' ? <AdminPanel /> : <Navigate to="/dashboard" />} />
                <Route path="/profile" element={auth ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/logout" element={<Logout setAuth={setAuth} />} />
                <Route path="/calendar" element={<MyCalendar />} />
                <Route path="/add-service" element={auth && userRole === 'admin' ? <AddService /> : <Navigate to="/dashboard" />} />
                <Route path="/services/list" element={auth && userRole === 'admin' ? <ServicesList /> : <Navigate to="/dashboard" />} />
                <Route path="/admin/users" element={auth && userRole === 'admin' ? <UsersManagement /> : <Navigate to="/dashboard" />} />
                <Route path="/admin/settings" element={auth && userRole === 'admin' ? <Settings /> : <Navigate to="/dashboard" />} />
                <Route path="/admin/stats" element={auth && userRole === 'admin' ? <Stats /> : <Navigate to="/dashboard" />} />
                <Route path="/add-employee" element={<AddEmployee />} />
                <Route path="/employees/list" element={auth ? <EmployeesList /> : <Navigate to="/login" />} />
                <Route path="/add-employees" element={<AddEmployeesTable />} />
            </Route>
            <Route path="*" element={<h2>404 - Strona nie znaleziona</h2>} />
        </Routes>
    );
};

export default App;