import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
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