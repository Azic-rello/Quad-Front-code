import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../modules/auth/authStore";

interface GuestRouteProps {
  children?: React.ReactNode;
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Agar foydalanuvchi login qilgan bo'lsa, uni login sahifasiga kiritmay dashboard'ga otamiz
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default GuestRoute;
