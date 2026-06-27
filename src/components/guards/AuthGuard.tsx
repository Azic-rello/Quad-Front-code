import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../modules/auth/authStore";

interface Props {
  roles?: string[];
}

const AuthGuard = ({ roles }: Props) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
