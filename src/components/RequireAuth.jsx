// src/components/RequireAuth.jsx

import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/**
 * 🔐 RequireAuth (Enhanced Premium Version)
 *
 * ✔ Protects routes based on:
 *    - Authentication (token + user)
 *    - Optional role-based access
 *
 * ✔ Handles:
 *    - Loading state (prevents flicker)
 *    - Expired session redirects
 *    - Reserved route access with message
 *
 * ✔ Sends user back to original page after login
 */

export default function RequireAuth({ children, allowedRoles }) {
  const { token, user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // 🕒 1) While auth is loading (prevents UI flicker)
  if (loading) {
    return (
      <div className="w-full h-40 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 🔒 2) No token → force login
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          message: "Please log in to continue.",
        }}
      />
    );
  }

  // ⚠ 3) Token exists but user missing → session expired or corrupted
  if (token && !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          message: "Session expired. Please log in again.",
        }}
      />
    );
  }

  // 🛡 4) Optional Role-based Protection
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          message: "You do not have permission to access this page.",
        }}
      />
    );
  }

  // 🎉 5) All Good → Render protected content
  return <>{children}</>;
}
