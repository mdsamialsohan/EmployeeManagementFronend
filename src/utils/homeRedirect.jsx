import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const HomeRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    // Not logged in, show login page at /
    return <Navigate to="/login" replace />;
  }

  // Logged in — redirect by role
  if (user.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  } else {
    return <Navigate to="/employee-dashboard" replace />;
  }
};

export default HomeRedirect;
