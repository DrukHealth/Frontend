import axios from "axios";

// ✅ Set your backend base URL (adjust if you're using a different port)
const BASE_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
