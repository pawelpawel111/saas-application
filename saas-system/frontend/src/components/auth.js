// auth.js - funkcje pomocnicze do obsługi tokenów

// Sprawdzenie, czy token jest obecny w localStorage
export const getToken = () => {
  const token = localStorage.getItem('token');
  return token;
};

// Ustawienie tokenu w localStorage
export const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  }
};

// Usunięcie tokenu z localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Funkcja sprawdzająca, czy token jest prawidłowy (np. czy nie jest wygasły)
export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));  // Dekodowanie JWT
    const exp = payload.exp;  // Zakładając, że JWT zawiera pole 'exp' (czas wygaśnięcia)
    if (exp < Date.now() / 1000) {
      removeToken(); // Jeśli token wygasł, usuń go
      return false;
    }
    return true;
  } catch (error) {
    console.error('Błąd przy sprawdzaniu ważności tokenu:', error);
    return false;
  }
};
