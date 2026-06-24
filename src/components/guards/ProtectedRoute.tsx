import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../modules/auth/authStore";
import type { Role } from "../../modules/auth/authTypes";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { user } = useAuthStore();

  // 2. Agar sahifaga kirish uchun ma'lum rollar talab qilinsa va foydalanuvchi roli mos kelmasa
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
