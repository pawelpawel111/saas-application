// frontend/src/components/Calendar/events.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/events";

export const getEvents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const addEvent = async (event) => {
  try {
    await axios.post(API_URL, event);
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
};

export const updateEvent = async (id, event) => {
  try {
    await axios.put(`${API_URL}/${id}`, event);
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};