import axios from "axios";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const api = axios.create({
  baseURL: BASE,
  headers: {
    "Content-Type": "application/json",
    // bypass ngrok free-tier browser-warning interstitial for API requests
    ...(BASE.includes("ngrok") ? { "ngrok-skip-browser-warning": "true" } : {}),
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cs_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("cs_token");
      localStorage.removeItem("cs_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
