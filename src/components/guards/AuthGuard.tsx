import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuthStore } from "../../modules/auth/authStore";

interface Props {
  roles?: string[];
}

const AuthGuard = ({ roles }: Props) => {
  const { user, isAuthenticated, isLoading, isInitialized, getMe } = useAuthStore();
  const hasRefreshToken = !!Cookies.get("refreshToken");

  useEffect(() => {
    // Agar ilova hali tekshirilmagan bo'lsa va cookieda token bo'lsa, profilni so'raymiz
    if (!isInitialized && hasRefreshToken && !isLoading) {
      getMe();
    }
  }, [isInitialized, hasRefreshToken, isLoading, getMe]);

  // Faqat yuklanish ketayotgan bo'lsa YOKI hali birinchi tekshiruv tugamagan bo'lsa loading ko'rsatiladi
  if (isLoading || (!isInitialized && hasRefreshToken)) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-2">Yuklanmoqda...</span>
      </div>
    );
  }

  // Agar tekshiruv tugagan bo'lsa va foydalanuvchi tizimga kirmagan bo'lsa
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Rollarni tekshirish (Manager ruxsati bor-yo'qligi)
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;