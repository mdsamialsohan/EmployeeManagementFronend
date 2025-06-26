import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or a spinner, skeleton, etc
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (requiredRole && !requiredRole.includes(user.role)) {
    // Redirect or show unauthorized message
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

export default ProtectedRoute;
