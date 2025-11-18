import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

/**
 * ProtectedRoute - Зөвхөн нэвтэрсэн хэрэглэгч нэвтрэх
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Loading state
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // Нэвтрээгүй бол login хуудас руу шилжүүлэх
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
