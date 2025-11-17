// src/utils/axiosInstance.js
import axios from "axios";

// ⚠️ Update this to your backend base URL
const instance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token automatically on every request
instance.interceptors.request.use((config) => {
  try {
    const auth = JSON.parse(localStorage.getItem("AUTH_STATE"));
    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
  } catch (e) {
    console.error("Failed to parse AUTH_STATE from localStorage");
  }
  return config;
});

// Auto-logout on 401 (expired/invalid token)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("AUTH_STATE");
      // Optional: you can use navigate in components; here we hard-redirect
      if (window.location.pathname !== "/login") {
        window.location.href = "/login?expired=true";
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
