const pool = require('../config/db');

const Employee = {
    getAll: async () => {
        try {
            const [rows] = await pool.query('SELECT * FROM employees');
            return rows;
        } catch (err) {
            console.error('Błąd podczas pobierania pracowników:', err);
            throw err;
        }
    },
    create: async (employee) => {
        const { name, surname, position, phone, email } = employee; // Zmieniono nazwy pól
        try {
            const [result] = await pool.query(
                'INSERT INTO employees (name, surname, position, phone, email) VALUES (?, ?, ?, ?, ?)', // Zmieniono nazwy kolumn
                [name, surname, position, phone, email]
            );
            return result;
        } catch (err) {
            console.error('Błąd dodawania pracownika:', err);
            throw err;
        }
    },
    update: async (id, employee) => {
        const { name, surname, position, phone, email } = employee; // Zmieniono nazwy pól
        try {
            const [result] = await pool.query(
                'UPDATE employees SET name = ?, surname = ?, position = ?, phone = ?, email = ? WHERE id = ?', // Zmieniono nazwy kolumn
                [name, surname, position, phone, email, id]
            );
            return result;
        } catch (err) {
            console.error('Błąd aktualizacji pracownika:', err);
            throw err;
        }
    },
    deleteEmployee: async (id) => {
        try {
            const [result] = await pool.query('DELETE FROM employees WHERE id = ?', [id]);
            return result;
        } catch (err) {
            console.error('Błąd usuwania pracownika:', err);
            throw err;
        }
    },
    createMultiple: async (employees) => {
        const values = employees.map(employee => [employee.name, employee.surname, employee.position, employee.phone, employee.email]); // Zmieniono nazwy pól
        try {
            const [result] = await pool.query('INSERT INTO employees (name, surname, position, phone, email) VALUES ?', [values]); // Zmieniono nazwy kolumn
            return result;
        } catch (err) {
            console.error('Błąd dodawania wielu pracowników:', err);
            throw err;
        }
    },
};

module.exports = Employee;