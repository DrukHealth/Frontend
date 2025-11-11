import axios from "axios";

// 🧠 Use environment variables for flexibility
const NODE_API_BASE_URL = import.meta.env.VITE_NODE_API_BASE_URL || "http://localhost:5000/api";
const FASTAPI_BASE_URL = import.meta.env.VITE_FASTAPI_BASE_URL || "http://127.0.0.1:8000";

// 🟢 Create separate axios instances
export const nodeAPI = axios.create({
  baseURL: NODE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fastAPI = axios.create({
  baseURL: FASTAPI_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🧩 Default export — Node API (most routes come from Node backend)
export default nodeAPI;
