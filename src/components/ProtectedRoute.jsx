import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, userData } = useAuth();

  // Belum login → redirect login
  if (!user) return <Navigate to="/login" replace />;

  // user sedang loading userData dari Firestore → jangan redirect dulu!
  if (!userData) return <div className="text-white p-4">Loading...</div>;

  return children;
}
