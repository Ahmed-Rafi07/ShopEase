// src/components/RequireAuth.jsx

import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/**
 * 🔐 RequireAuth (Premium Version)
 *
 * - Protects routes by checking:
 *    ✔ Token exists
 *    ✔ User object exists
 *    ✔ Optional role-based access
 *
 * - Redirects to /login with the "from" location
 *   so user returns back after login.
 *
 * - Provides smooth, professional fallback behavior.
 */

export default function RequireAuth({ children, allowedRoles }) {
  const { token, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1️⃣ No token → user not logged in
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          message: "You must be logged in to access this page.",
        }}
      />
    );
  }

  // 2️⃣ Token exists but no user → corrupted session / expired token
  if (token && !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          message: "Your session has expired. Please log in again.",
        }}
      />
    );
  }

  // 3️⃣ Optional role-based protection → e.g. Admin routes
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <Navigate
        to="/"
        replace
        state={{ message: "You don't have permission to access this page." }}
      />
    );
  }

  // 4️⃣ Finally, show the protected content
  return <>{children}</>;
}
