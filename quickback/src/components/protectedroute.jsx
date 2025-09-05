// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // if not logged in, kick back to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
