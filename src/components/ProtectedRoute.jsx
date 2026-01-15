import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, userData } = useAuth();


  if (!user) return <Navigate to="/login" replace />;

  if (!userData) return <div className="text-white p-4">Loading...</div>;

  return children;
}
