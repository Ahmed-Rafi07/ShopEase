// src/utils/axiosInstance.js
import axios from "axios";

/* -------------------------------------------------------
   🔥 PREMIUM AXIOS INSTANCE
   - Auto token attach
   - Auto logout on 401
   - Handles JSON parse errors safely
   - Works with Vite env + fallback URL
------------------------------------------------------- */

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000/api";

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // prevents hanging requests
});

// -------------------------------------------------------
// 🔒 Attach Bearer Token to every request
// -------------------------------------------------------
instance.interceptors.request.use((config) => {
  try {
    const authString = localStorage.getItem("AUTH_STATE");
    if (authString) {
      const auth = JSON.parse(authString);
      if (auth?.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
    }
  } catch (err) {
    console.warn("AUTH_STATE is corrupted in localStorage");
  }

  return config;
});

// -------------------------------------------------------
// 🚫 Auto Logout if token expired (401)
// -------------------------------------------------------
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;

    if (status === 401) {
      localStorage.removeItem("AUTH_STATE");

      const isNotOnLogin =
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/signup");

      if (isNotOnLogin) {
        window.location.href = "/login?expired=true";
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
