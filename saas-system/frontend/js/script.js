// frontend/js/script.js

// Funkcja do pobierania statystyk
function fetchStats() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Brak tokenu autoryzacyjnego.');
        return;
    }

    fetch('/api/stats', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Błąd HTTP! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('stats').innerHTML = `Usługi: ${data.services}, Pracownicy: ${data.employees}`;
    })
    .catch(error => {
        console.error('Błąd pobierania statystyk:', error);
        document.getElementById('stats').innerHTML = 'Błąd pobierania statystyk.';
    });
}

// Funkcja do pobierania usług
function fetchServices() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Brak tokenu autoryzacyjnego.');
        return;
    }

    fetch('/api/services', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Błąd HTTP! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const serviceList = document.getElementById('service-list');
        serviceList.innerHTML = ''; // Wyczyść listę przed dodaniem nowych elementów
        data.forEach(service => {
            const listItem = document.createElement('li');
            listItem.textContent = service.name;
            serviceList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Błąd pobierania usług:', error);
        document.getElementById('service-list').innerHTML = 'Błąd pobierania usług.';
    });
}

// Funkcja do pobierania pracowników
function fetchEmployees() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Brak tokenu autoryzacyjnego.');
        return;
    }

    fetch('/api/employees', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Błąd HTTP! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const employeeList = document.getElementById('employee-list');
        employeeList.innerHTML = ''; // Wyczyść listę przed dodaniem nowych elementów
        data.forEach(employee => {
            const listItem = document.createElement('li');
            listItem.textContent = employee.name;
            employeeList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Błąd pobierania pracowników:', error);
        document.getElementById('employee-list').innerHTML = 'Błąd pobierania pracowników.';
    });
}

// Wywołanie funkcji
fetchStats();
fetchServices();
fetchEmployees();