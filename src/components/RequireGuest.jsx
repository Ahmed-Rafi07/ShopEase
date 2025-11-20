import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * 🚪 RequireGuest
 * 
 * Used for pages like:
 *  - Login
 *  - Register
 *
 * If the user is already authenticated, they are redirected away
 * to avoid accessing guest-only pages again.
 */

export default function RequireGuest({ children, redirectTo = "/" }) {
  const { token, loading } = useSelector((state) => state.auth);

  // 🕒 Prevent flicker while auth is loading
  if (loading) {
    return (
      <div className="w-full h-40 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If token exists → already logged in → redirect to homepage (or admin, optionally)
  if (token) {
    return <Navigate to={redirectTo} replace />;
  }

  // Otherwise, show guest-only content (Login/Register)
  return children;
}
