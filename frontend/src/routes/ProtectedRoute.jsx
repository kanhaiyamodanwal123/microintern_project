import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // wait until session restored
  if (loading) return <p className="p-10">Loading...</p>;

  if (!user) return <Navigate to="/login" />;

  return children;
}
