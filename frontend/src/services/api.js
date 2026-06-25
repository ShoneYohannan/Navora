import axios from 'axios';
import { generateItinerary, destinationsData } from './mockData';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Helper for local storage of saved trips
const getLocalTrips = () => {
  try {
    const data = localStorage.getItem('saved_trips');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Local storage read error:", e);
    return [];
  }
};

const saveLocalTrip = (trip) => {
  try {
    const trips = getLocalTrips();
    // Check if trip already exists
    const idx = trips.findIndex(t => t.id === trip.id || t._id === trip._id || t.id === trip._id || t._id === trip.id);
    if (idx >= 0) {
      trips[idx] = { ...trips[idx], ...trip };
    } else {
      trips.push(trip);
    }
    localStorage.setItem('saved_trips', JSON.stringify(trips));
  } catch (e) {
    console.error("Local storage save error:", e);
  }
};

const deleteLocalTrip = (id) => {
  try {
    const trips = getLocalTrips();
    const filtered = trips.filter(t => t.id !== id && t._id !== id);
    localStorage.setItem('saved_trips', JSON.stringify(filtered));
  } catch (e) {
    console.error("Local storage delete error:", e);
  }
};

export const travelApi = {
  generateTrip: async (formData) => {
    try {
      const response = await api.post('/generate-trip', formData);
      return response;
    } catch (error) {
      console.warn("Backend unavailable. Generating trip offline using mock service.", error);
      // Fallback
      const mockTrip = generateItinerary(
        formData.destination || "kochi",
        formData.duration || 3,
        formData.budget || "mid-range",
        formData.interests && formData.interests.length > 0 ? formData.interests[0] : "Culture"
      );
      // Auto save locally
      saveLocalTrip(mockTrip);
      return { data: mockTrip };
    }
  },

  saveTrip: async (tripData) => {
    try {
      const response = await api.post('/save-trip', tripData);
      return response;
    } catch (error) {
      console.warn("Backend unavailable. Saving trip locally.", error);
      saveLocalTrip(tripData);
      return { data: { ...tripData, id: tripData.id || `trip_${Date.now()}` } };
    }
  },

  getTripHistory: async () => {
    try {
      const response = await api.get('/trip-history');
      return response;
    } catch (error) {
      console.warn("Backend unavailable. Fetching trip history locally.", error);
      const local = getLocalTrips();
      // Format to support backend naming conventions (_id or id)
      return { data: local.map(t => ({ ...t, _id: t.id })) };
    }
  },

  getTrip: async (id) => {
    try {
      const response = await api.get(`/trip/${id}`);
      return response;
    } catch (error) {
      console.warn("Backend unavailable. Fetching specific trip locally.", error);
      const local = getLocalTrips();
      const trip = local.find(t => t.id === id || t._id === id);
      if (trip) {
        return { data: trip };
      }
      // If not found, create a dynamic fallback based on ID patterns
      let dest = "kochi";
      if (id.startsWith("munnar")) dest = "munnar";
      if (id.startsWith("alleppey")) dest = "alleppey";
      if (id.startsWith("wayanad")) dest = "wayanad";
      if (id.startsWith("goa")) dest = "goa";
      if (id.startsWith("jaipur")) dest = "jaipur";
      
      const newMock = generateItinerary(dest, 3, "mid-range", "Culture");
      newMock.id = id;
      saveLocalTrip(newMock);
      return { data: newMock };
    }
  },

  deleteTrip: async (id) => {
    try {
      const response = await api.delete(`/trip/${id}`);
      return response;
    } catch (error) {
      console.warn("Backend unavailable. Deleting trip locally.", error);
      deleteLocalTrip(id);
      return { data: { success: true } };
    }
  },

  exportPdf: async (id) => {
    try {
      const response = await api.post(`/trip/${id}/export-pdf`, {}, { responseType: 'blob' });
      return response;
    } catch (error) {
      console.warn("Backend unavailable. Simulating local PDF export download.", error);
      // Fetch details
      const local = getLocalTrips();
      const trip = local.find(t => t.id === id || t._id === id) || generateItinerary("kochi", 3);
      
      // Build text file
      let text = `AI TRAVEL PLANNER ITINERARY REPORT\n`;
      text += `Destination: ${trip.destination}\n`;
      text += `Duration: ${trip.duration} Days\n`;
      text += `Dates: ${trip.dates}\n`;
      text += `Travel Score: ${trip.travel_quality_score}% | Safety Score: ${trip.safety_score}%\n\n`;
      text += `--- Daily Details ---\n`;
      trip.itinerary.days.forEach(day => {
        text += `${day.day} - ${day.theme}\n`;
        day.activities.forEach(act => {
          text += `  * ${act}\n`;
        });
        text += `\n`;
      });
      text += `--- Budget Estimated ---\n`;
      Object.entries(trip.budget_breakdown).forEach(([k, v]) => {
        text += `  - ${k}: $${v}\n`;
      });

      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      return { data: blob };
    }
  },

  // Get place by ID (for Place Details Page)
  getPlaceDetails: async (placeId) => {
    // Loop through destinationsData to find placeId
    for (const key of Object.keys(destinationsData)) {
      const city = destinationsData[key];
      const items = [...city.attractions, ...city.restaurants, ...city.hotels, ...city.events];
      const found = items.find(item => item.id === placeId);
      if (found) {
        return { data: { ...found, destinationName: city.name } };
      }
    }
    return { data: null };
  },

  // Explore details of a destination (for Results Page)
  getDestinationDetails: async (destinationKey) => {
    const key = destinationKey.toLowerCase().trim();
    if (destinationsData[key]) {
      return { data: destinationsData[key] };
    }
    // Default fallback to Kochi
    return { data: destinationsData.kochi };
  }
};

export default api;
