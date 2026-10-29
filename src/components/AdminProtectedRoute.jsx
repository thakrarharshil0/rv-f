import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const AdminProtectedRoute = ({ children }) => {
  const { user, isAuthLoading, isAuthenticated } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check if authenticated AND role is admin
  if (!isAuthenticated || user?.role !== "admin") {
    // Redirect to the custom admin login page
    return <Navigate to="/login/admin" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
