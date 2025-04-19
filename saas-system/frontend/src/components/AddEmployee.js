import { useState } from "react";
import axios from "axios";

const AddEmployee = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [position, setPosition] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!name || !surname || !position || !phone || !email) {
            setError("Wszystkie pola są wymagane!");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Brak tokenu uwierzytelniającego.');
            }
            const response = await axios.post("/api/employees", {
                name,
                surname,
                position,
                phone,
                email
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Pracownik dodany:", response.data);
            setSuccessMessage("Pracownik dodany pomyślnie!");
            setName("");
            setSurname("");
            setPosition("");
            setPhone("");
            setEmail("");
        } catch (error) {
            console.error("Błąd przy dodawaniu pracownika:", error.response ? error.response.data : error.message);
            setError("Wystąpił błąd podczas dodawania pracownika.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

            <label>Imię:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

            <label>Nazwisko:</label>
            <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />

            <label>Stanowisko:</label>
            <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} />

            <label>Telefon:</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />

            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <button type="submit">Dodaj pracownika</button>
        </form>
    );
};

export default AddEmployee;