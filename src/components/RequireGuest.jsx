import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RequireGuest({ children }) {
  const { token } = useSelector((s) => s.auth);

  return token ? <Navigate to="/" replace /> : children;
}
