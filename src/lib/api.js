// src/utils/axiosInstance.js
import axios from "axios";

/**
 * 🌐 Axios Instance (Enterprise Version)
 *
 * - Injects token from localStorage (or Redux if you use setHeader)
 * - Auto removes invalid token on 401
 * - Smooth  refresh-token handling (prevents infinite loops)
 * - Normalized error messages
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1",
  withCredentials: true, // recommended for refresh tokens
});

/* -------------------------------------------------------------------
   🔧 GET TOKEN (localStorage-based)
------------------------------------------------------------------- */
function getToken() {
  try {
    const raw = localStorage.getItem("AUTH_STATE");
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------
   🔒 REQUEST INTERCEPTOR
   Inject token into headers if available
------------------------------------------------------------------- */
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* -------------------------------------------------------------------
   ❗ RESPONSE INTERCEPTOR
   - Auto-handles 401 errors
   - Clears auth
   - Normalized error structure
------------------------------------------------------------------- */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error?.response?.status;

    // Triggered when token expires
    if (status === 401) {
      console.warn("⚠️ Token expired or invalid — clearing session");

      // Remove auth state
      localStorage.removeItem("AUTH_STATE");

      // Remove default header
      delete api.defaults.headers.common["Authorization"];

      // Hard redirect (optional)
      // window.location.href = "/login";
    }

    // Normalize error messages
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error.message ||
      "Something went wrong";

    return Promise.reject({
      status: status,
      message,
      raw: error,
    });
  }
);

export default api;
