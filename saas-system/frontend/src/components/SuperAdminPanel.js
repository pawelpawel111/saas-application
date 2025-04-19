import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SuperAdminPanel = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole === 'superadmin') {
      setRole(storedRole);
    } else {
      navigate('/login'); // Jeśli użytkownik nie jest superadminem, przekieruj go na stronę logowania
    }
  }, [navigate]);

  if (role !== 'superadmin') {
    return <p>Brak dostępu do tej strony.</p>;
  }

  return (
    <div>
      <h2>Panel Super Admina</h2>
      {/* Możesz tutaj dodać opcje dodawania kont itp. */}
    </div>
  );
};

export default SuperAdminPanel;
