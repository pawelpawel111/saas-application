const Employee = require('../models/Employee');

const getAllEmployees = async (req, res) => {
    try {
        console.log('Rozpoczęto pobieranie pracowników...');
        const employees = await Employee.getAll();
        console.log('Dane z modelu Employee.getAll():', employees);

        if (employees.length === 0) {
            console.log('Brak pracowników w bazie danych.');
            return res.status(404).json({ message: 'Brak pracowników w bazie' });
        }

        console.log('Pobrano pracowników pomyślnie.');
        res.json(employees);
    } catch (err) {
        console.error('Błąd pobierania pracowników:', err);
        console.error('Ślad stosu:', err.stack);
        return res.status(500).json({ message: 'Błąd serwera', error: err.message });
    }
};

const createEmployee = async (req, res) => {
    try {
        console.log('Backend: Otrzymane dane (req.body):', req.body); // Dodano log

        const { name, surname, position, email, phone } = req.body;

        if (!name || !surname || !position || !email || !phone) {
            console.log('Błąd: Brak wymaganych danych.');
            return res.status(400).json({ message: 'Wszystkie dane są wymagane' });
        }

        const result = await Employee.create({ name, surname, position, email, phone });
        console.log('Nowy pracownik dodany:', result);
        res.status(201).json({ message: 'Pracownik dodany', id: result.insertId });
    } catch (err) {
        console.error('Błąd przy tworzeniu pracownika:', err);
        console.error('Ślad stosu:', err.stack);
        return res.status(500).json({ message: 'Błąd przy tworzeniu pracownika', error: err.message });
    }
};

const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { name, surname, position, email, phone } = req.body;

    if (!name || !surname || !position || !email || !phone) {
        console.log('Błąd: Brak wymaganych danych.');
        return res.status(400).json({ message: 'Wszystkie dane są wymagane' });
    }

    try {
        console.log('Rozpoczęto aktualizację pracownika...');
        const result = await Employee.update(id, { name, surname, position, email, phone });
        if (result.affectedRows === 0) {
            console.log('Błąd: Pracownik o podanym ID nie istnieje.');
            return res.status(404).json({ message: 'Pracownik o podanym ID nie istnieje' });
        }
        console.log('Pracownik zaktualizowany:', id);
        res.json({ message: 'Pracownik zaktualizowany' });
    } catch (err) {
        console.error('Błąd przy aktualizacji pracownika:', err);
        console.error('Ślad stosu:', err.stack);
        return res.status(500).json({ message: 'Błąd przy aktualizacji pracownika', error: err.message });
    }
};

const deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        console.log('Rozpoczęto usuwanie pracownika...');
        const result = await Employee.deleteEmployee(id);
        if (result.affectedRows === 0) {
            console.log('Błąd: Pracownik o podanym ID nie istnieje.');
            return res.status(404).json({ message: 'Pracownik o podanym ID nie istnieje' });
        }
        console.log('Pracownik usunięty:', id);
        res.json({ message: 'Pracownik usunięty' });
    } catch (err) {
        console.error('Błąd przy usuwaniu pracownika:', err);
        console.error('Ślad stosu:', err.stack);
        return res.status(500).json({ message: 'Błąd przy usuwaniu pracownika', error: err.message });
    }
};

const createMultipleEmployees = async (req, res) => {
    const employees = req.body;

    if (!Array.isArray(employees) || employees.length === 0) {
        console.log('Błąd: Nieprawidłowe dane (nie tablica lub pusta tablica).');
        return res.status(400).json({ message: 'Nieprawidłowe dane.' });
    }

    try {
        console.log('Rozpoczęto dodawanie wielu pracowników...');
        await Employee.createMultiple(employees);
        console.log('Pracownicy dodani pomyślnie.');
        res.status(201).json({ message: 'Pracownicy dodani pomyślnie.' });
    } catch (err) {
        console.error('Błąd dodawania pracowników:', err);
        console.error('Ślad stosu:', err.stack);
        return res.status(500).json({ message: 'Błąd serwera.', error: err.message });
    }
};

module.exports = {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    createMultipleEmployees,
};