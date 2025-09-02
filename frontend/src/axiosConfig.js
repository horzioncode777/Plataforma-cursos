// frontend/src/axiosConfig.js
import axios from "axios";
import API_URL from "./api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // si usas cookies/sesión
});

export default api;
