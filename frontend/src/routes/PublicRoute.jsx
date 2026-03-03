import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    if (user.role === "student")
      return <Navigate to="/" replace />;

    if (user.role === "employer")
      return <Navigate to="/employer-dashboard" replace />;

    if (user.role === "admin")
      return <Navigate to="/admin" replace />;
  }

  return children;
}
