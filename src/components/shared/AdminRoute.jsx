import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

/**
 * AdminRoute - Зөвхөн admin эрхтэй хэрэглэгч нэвтрэх
 */
function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Loading state
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // Нэвтрээгүй бол login хуудас руу
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin биш бол нүүр хуудас руу
  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-destructive">Хандах эрхгүй</h2>
          <p className="text-muted-foreground">
            Уучлаарай, та энэ хуудас руу нэвтрэх эрхгүй байна.
          </p>
          <button
            onClick={() => window.history.back()}
            className="text-primary hover:underline"
          >
            Буцах
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default AdminRoute;
