import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { Loader } from "lucide-react";

export function ProtectedRoute() {
  const { isLoggedIn, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) return <Loader />;

  return isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
