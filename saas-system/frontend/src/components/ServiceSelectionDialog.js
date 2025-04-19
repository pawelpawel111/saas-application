import React, { useState } from 'react';
import moment from 'moment';

const ServiceSelectionDialog = ({ services, onSelect, onClose, slotSelection, events }) => {
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDuration, setSelectedDuration] = useState(1); // Domyślny czas trwania: 1 godzina
    const availableTimes = generateAvailableTimes(slotSelection.start, slotSelection.end, events, selectedDuration);

    const handleServiceChange = (e) => {
        setSelectedServiceId(e.target.value);
        console.log('Service selection dialog: Selected service id:', e.target.value);
    };

    const handleTimeChange = (e) => {
        const selectedStartTime = moment(e.target.value, 'HH:mm').toDate();
        setSelectedTime(selectedStartTime);
        console.log('Service selection dialog: Selected start time:', selectedStartTime);
    };

    const handleDurationChange = (e) => {
        setSelectedDuration(parseInt(e.target.value));
        console.log('Service selection dialog: Selected duration:', e.target.value);
    };

    const handleSave = () => {
        onSelect(selectedServiceId, selectedTime, selectedDuration); // Przekazanie czasu trwania
    };

    return (
        <div className="dialog">
            <h2>Wybierz usługę i godzinę</h2>
            <select value={selectedServiceId} onChange={handleServiceChange}>
                <option value="">Wybierz usługę</option>
                {services.map(service => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                ))}
            </select>
            <select value={selectedTime ? moment(selectedTime).format('HH:mm') : ''} onChange={handleTimeChange}>
                <option value="">Wybierz godzinę</option>
                {availableTimes.map(time => (
                    <option key={time} value={time}>{time}</option>
                ))}
            </select>
            <select value={selectedDuration} onChange={handleDurationChange}>
                <option value={1}>1 godzina</option>
                <option value={2}>2 godziny</option>
                <option value={3}>3 godziny</option>
            </select>
            <button onClick={handleSave}>Zapisz</button>
            <button onClick={onClose}>Anuluj</button>
        </div>
    );
};

const generateAvailableTimes = (startOfDay, endOfDay, events, duration = 1) => {
    const times = [];
    let currentTime = moment(startOfDay);
    while (currentTime.isBefore(endOfDay)) {
        const isAvailable = checkTimeSlotAvailability(currentTime.toDate(), currentTime.clone().add(duration, 'hour').toDate(), events);
        if (isAvailable) {
            times.push(currentTime.format('HH:mm'));
        }
        currentTime.add(1, 'hour');
    }
    return times;
};

const checkTimeSlotAvailability = (startTime, endTime, events) => {
    if (!events) {
        console.error('Błąd: events jest undefined w checkTimeSlotAvailability.');
        return true; // Jeśli events jest undefined, zakładamy, że przedział czasu jest dostępny
    }
    const isAvailable = !events.some(event => {
        return (startTime >= event.start && startTime < event.end) || (endTime > event.start && endTime <= event.end) || (startTime <= event.start && endTime >= event.end);
    });
    return isAvailable;
};

export default ServiceSelectionDialog;