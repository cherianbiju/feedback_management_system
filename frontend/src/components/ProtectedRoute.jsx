import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly }) {
  const username = localStorage.getItem("username");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (adminOnly && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  if (!adminOnly && !username) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}
