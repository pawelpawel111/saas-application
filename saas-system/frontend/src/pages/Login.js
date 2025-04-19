// Login.js
import React from 'react';
import LoginForm from '../components/LoginForm'; // Importuj komponent formularza logowania

function Login() {
  return (
    <div>
      <h2>Logowanie</h2>
      <LoginForm />
      {/* Dodaj link do rejestracji lub resetowania hasła */}
    </div>
  );
}

export default Login;