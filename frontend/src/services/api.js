import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const travelApi = {
  generateTrip: (data) => api.post('/generate-trip', data),
  saveTrip: (data) => api.post('/save-trip', data),
  getTripHistory: () => api.get('/trip-history'),
  getTrip: (id) => api.get(`/trip/${id}`),
  deleteTrip: (id) => api.delete(`/trip/${id}`),
  exportPdf: (id) => api.post(`/trip/${id}/export-pdf`, {}, { responseType: 'blob' }),
};

export default api;
