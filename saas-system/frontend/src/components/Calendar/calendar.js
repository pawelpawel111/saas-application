import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./styles.css";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const localizer = momentLocalizer(moment);

// Konfiguracja axios
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor do dodawania tokenu
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Pomocnicza funkcja do sprawdzania dostępności terminu
const checkTimeSlotAvailability = (startTime, endTime, events) => {
    if (!events) return true;
    return !events.some(event => (
        (startTime >= event.start && startTime < event.end) ||
        (endTime > event.start && endTime <= event.end) ||
        (startTime <= event.start && endTime >= event.end)
    ));
};

const MyCalendar = () => {
    const [events, setEvents] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [serviceSelectionDialogOpen, setServiceSelectionDialogOpen] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [slotSelection, setSlotSelection] = useState(null);

    const formats = {
        timeGutterFormat: 'HH:mm',
        eventTimeRangeFormat: ({ start, end }, culture, local) =>
            local.format(start, 'HH:mm', culture) + ' - ' + local.format(end, 'HH:mm', culture),
        dayFormat: 'DD-MM-YYYY',
        monthHeaderFormat: 'MMMM YYYY',
    };

    const fetchEventsAndServices = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Brak tokenu uwierzytelniającego. Zaloguj się ponownie.');
                return;
            }

            const [eventsResponse, servicesResponse] = await Promise.all([
                api.get('/events'),
                api.get('/services')
            ]);

            const eventsWithServices = eventsResponse.data.map(event => {
                const service = servicesResponse.data.find(s => s.id === event.serviceId);
                return {
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end),
                    title: service ? service.name : 'Usługa nieznana'
                };
            });

            setEvents(eventsWithServices);
            setServices(servicesResponse.data);
            setError(null);
        } catch (err) {
            console.error('Błąd podczas pobierania danych:', err);
            handleApiError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventsAndServices();
    }, []);

    const handleSelectSlot = ({ start, end }) => {
        const roundedStart = moment(start).startOf('hour').toDate();
        const roundedEnd = moment(end).startOf('hour').toDate();
        setSlotSelection({ start: roundedStart, end: roundedEnd });
        setServiceSelectionDialogOpen(true);
    };

    const handleServiceSelection = async (serviceId, selectedStartTime, serviceDuration) => {
        if (!serviceId || !selectedStartTime) return;

        try {
            const startTime = moment(selectedStartTime);
            const endTime = moment(selectedStartTime).add(serviceDuration, 'hours');

            if (!checkTimeSlotAvailability(startTime.toDate(), endTime.toDate(), events)) {
                alert('Wybrany termin jest już zajęty');
                return;
            }

            const newEvent = {
                serviceId: parseInt(serviceId),
                start: startTime.toISOString(),
                end: endTime.toISOString()
            };

            const response = await api.post('/events', newEvent);

            const service = services.find(s => s.id === parseInt(serviceId));
            const createdEvent = {
                id: response.data.id || uuidv4(),
                ...newEvent,
                start: startTime.toDate(),
                end: endTime.toDate(),
                title: service ? service.name : 'Usługa nieznana'
            };

            setEvents(prevEvents => [...prevEvents, createdEvent]);
            setError(null);
        } catch (err) {
            console.error('Błąd podczas dodawania wydarzenia:', err);
            handleApiError(err);
        }

        setServiceSelectionDialogOpen(false);
        setSlotSelection(null);
    };

    const handleApiError = (err) => {
        if (err.response) {
            if (err.response.status === 401) {
                setError('Sesja wygasła. Zaloguj się ponownie.');
            } else if (err.response.status === 400) {
                setError('Nieprawidłowe dane. Sprawdź formularz i spróbuj ponownie.');
            } else {
                setError(`Błąd serwera: ${err.response.status}`);
            }
        } else if (err.request) {
            setError('Nie można połączyć się z serwerem. Sprawdź połączenie internetowe.');
        } else {
            setError(`Wystąpił błąd: ${err.message}`);
        }
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setSelectedServiceId(event.serviceId);
    };

    const handleUpdateEvent = async () => {
        if (!selectedEvent || !selectedServiceId) return;

        try {
            await api.put(`/events/${selectedEvent.id}`, {
                serviceId: parseInt(selectedServiceId)
            });

            const service = services.find(s => s.id === parseInt(selectedServiceId));
            const updatedEvents = events.map(event => 
                event.id === selectedEvent.id 
                    ? { ...event, serviceId: parseInt(selectedServiceId), title: service.name }
                    : event
            );

            setEvents(updatedEvents);
            setSelectedEvent(null);
            setError(null);
        } catch (err) {
            console.error('Błąd podczas aktualizacji wydarzenia:', err);
            handleApiError(err);
        }
    };

    const handleDeleteEvent = async () => {
        if (!selectedEvent) return;
        setConfirmationDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await api.delete(`/events/${selectedEvent.id}`);
            setEvents(prevEvents => prevEvents.filter(event => event.id !== selectedEvent.id));
            setSelectedEvent(null);
            setError(null);
        } catch (err) {
            console.error('Błąd podczas usuwania wydarzenia:', err);
            handleApiError(err);
        }
        setConfirmationDialogOpen(false);
    };

    if (loading) return <div>Ładowanie danych...</div>;
    if (error) return (
        <div className="error-container">
            <div className="error-message">{error}</div>
            <button onClick={fetchEventsAndServices} className="btn-retry">
                Spróbuj ponownie
            </button>
        </div>
    );

    return (
        <div className="calendar-container">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                style={{ height: 500 }}
                formats={formats}
                step={60}
                timeslots={1}
            />
            {selectedEvent && (
                <div className="event-dialog">
                    <h2>Edycja wydarzenia</h2>
                    <p>Usługa: {selectedEvent.title}</p>
                    <p>Data rozpoczęcia: {moment(selectedEvent.start).format('DD-MM-YYYY HH:mm')}</p>
                    <p>Data zakończenia: {moment(selectedEvent.end).format('DD-MM-YYYY HH:mm')}</p>
                    <select 
                        value={selectedServiceId} 
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                        className="select-input"
                    >
                        {services.map(service => (
                            <option key={service.id} value={service.id}>
                                {service.name}
                            </option>
                        ))}
                    </select>
                    <div className="button-group">
                        <button onClick={handleUpdateEvent} className="btn-save">Zapisz</button>
                        <button onClick={handleDeleteEvent} className="btn-delete">Usuń</button>
                        <button onClick={() => setSelectedEvent(null)} className="btn-cancel">Anuluj</button>
                    </div>
                </div>
            )}
            {serviceSelectionDialogOpen && (
                <ServiceSelectionDialog
                    services={services}
                    onSelect={handleServiceSelection}
                    onClose={() => setServiceSelectionDialogOpen(false)}
                    slotSelection={slotSelection}
                    events={events}
                />
            )}
            {confirmationDialogOpen && (
                <ConfirmationDialog
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setConfirmationDialogOpen(false)}
                />
            )}
        </div>
    );
};

const ServiceSelectionDialog = ({ services, onSelect, onClose, slotSelection, events }) => {
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDuration, setSelectedDuration] = useState(1);

    useEffect(() => {
        if (slotSelection) {
            setSelectedTime(moment(slotSelection.start).format('HH:mm'));
        }
    }, [slotSelection]);

    const generateTimeSlots = () => {
        const slots = [];
        const startTime = moment(slotSelection.start).startOf('day');
        const endTime = moment(slotSelection.start).endOf('day');

        while (startTime.isBefore(endTime)) {
            const timeSlot = startTime.format('HH:mm');
            const slotStartTime = moment(slotSelection.start).format('YYYY-MM-DD') + ' ' + timeSlot;
            const slotEndTime = moment(slotStartTime).add(selectedDuration, 'hours');

            const isAvailable = checkTimeSlotAvailability(
                new Date(slotStartTime),
                slotEndTime.toDate(),
                events
            );

            if (isAvailable) {
                slots.push(timeSlot);
            }

            startTime.add(30, 'minutes');
        }

        return slots;
    };

    const handleSave = () => {
        if (!selectedServiceId || !selectedTime) {
            alert('Wybierz usługę i godzinę');
            return;
        }

        const selectedDateTime = moment(slotSelection.start)
            .format('YYYY-MM-DD') + ' ' + selectedTime;

        onSelect(
            selectedServiceId,
            new Date(selectedDateTime),
            selectedDuration
        );
    };

    return (
        <div className="dialog">
            <h2>Wybierz usługę i godzinę</h2>
            <select 
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="select-input"
            >
                <option value="">Wybierz usługę</option>
                {services.map(service => (
                    <option key={service.id} value={service.id}>
                        {service.name}
                    </option>
                ))}
            </select>
            <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="select-input"
            >
                <option value="">Wybierz godzinę</option>
                {generateTimeSlots().map(time => (
                    <option key={time} value={time}>{time}</option>
                ))}
            </select>
            <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
                className="select-input"
            >
                <option value={1}>1 godzina</option>
                <option value={2}>2 godziny</option>
                <option value={3}>3 godziny</option>
            </select>
            <div className="button-group">
                <button onClick={handleSave} className="btn-save">Zapisz</button>
                <button onClick={onClose} className="btn-cancel">Anuluj</button>
            </div>
        </div>
    );
};

const ConfirmationDialog = ({ onConfirm, onCancel }) => {
    return (
        <div className="dialog">
            <h2>Czy na pewno chcesz usunąć to wydarzenie?</h2>
            <div className="button-group">
                <button onClick={onConfirm} className="btn-delete">Tak</button>
                <button onClick={onCancel} className="btn-cancel">Nie</button>
            </div>
        </div>
    );
};

export default MyCalendar;