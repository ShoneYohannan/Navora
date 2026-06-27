import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://navora-676643876359.asia-south1.run.app/api",
});

export const generateTrip = (tripData) => {
  return API.post("/generate-trip", tripData);
};

export const saveTrip = (tripData) => {
  return API.post("/save-trip", tripData);
};

export const getTripHistory = () => {
  return API.get("/trip-history");
};

export default API;