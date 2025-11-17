// src/components/RequireAuth.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ✅ RequireAuth component
 * This wraps around any protected route.
 * It checks if the user has a valid token in Redux (auth state).
 * If not logged in → redirects to /login with previous route info.
 * After login, the user is taken back to where they were.
 */

export default function RequireAuth({ children }) {
  const { token, user } = useSelector((state) => state.auth); // access auth state
  const location = useLocation();

  // If no token → redirect to login
  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }} // keep track of where user came from
        replace
      />
    );
  }

  // Optional: Check for expired token or invalid user (future-proof)
  if (token && user === null) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, message: "Session expired. Please log in again." }}
        replace
      />
    );
  }

  // Otherwise render the protected route content
  return children;
}
