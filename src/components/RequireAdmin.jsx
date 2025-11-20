import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const { user, loading } = useSelector((state) => state.auth);

  // If auth state is still loading, prevent redirect flicker
  if (loading) {
    return (
      <div className="w-full h-40 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user is not logged in OR role is not admin/developer
  if (!user || !["admin", "developer", "superadmin"].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If user is admin → allow access
  return children;
}
