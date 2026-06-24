import { createBrowserRouter, Navigate } from "react-router-dom";

// 🏢 Layoutlar
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ManagerLayout from "../pages/dashboard/manager/ManagerLayout"; // 👈 Sening tayyor layouting

// 📄 Public (Mijoz) sahifalari
import AboutLayout from "../pages/public/About/AboutLayout";
import BasketLayout from "../pages/public/Basket/BasketLayout";
import HomeLayout from "../pages/public/Home/HomeLayout";
import MenuLayout from "../pages/public/Menu/MenuLayout";
import NewsLayout from "../pages/public/News/NewsLayout";

// 🔐 Auth sahifalari
import Login from "../pages/auth/Login";

// 🛡️ Guards
import ProtectedRoute from "../components/guards/ProtectedRoute";
import GuestRoute from "../components/guards/GuestRoute";

// 📄 Dashboard sahifalari
import SuperAdmin from "../pages/dashboard/SuperAdmin/SuperAdmin";

// 🔄 Dinamik Yo'naltiruvchi Komponent
// Dashboardga kirganda kim kirganiga qarab (SuperAdmin yoki Manager) to'g'ri joyga otib yuboradi
const DashboardIndexRedirect = () => {
  const currentUser = localStorage.getItem("current_user");

  if (currentUser) {
    const user = JSON.parse(currentUser);
    if (user.role === "manager") {
      return <Navigate to="/dashboard/manager" replace />;
    }
  }
  // Agar xotirada user bo'lmasa yoki roli superadmin bo'lsa default superadminga ketadi
  return <Navigate to="/dashboard/superadmin" replace />;
};

export const router = createBrowserRouter([
  {
    // 🌐 1. Tashqi sayt qismi (Mijozlar uchun - hamma kira oladi)
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomeLayout /> },
      { path: "menu", element: <MenuLayout /> },
      { path: "news", element: <NewsLayout /> },
      { path: "about", element: <AboutLayout /> },
      { path: "basket", element: <BasketLayout /> },
    ],
  },

  // 🔐 2. AVTORIZATSIYA (Faqat tizimga kirmagan mehmonlar uchun)
  {
    path: "/auth",
    element: <GuestRoute />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: "login", element: <Login /> },
    ],
  },

  // 🔄 Eski login havolasini yangisiga yo'naltirish
  {
    path: "/login",
    element: <Navigate to="/auth/login" replace />,
  },

  {
    // 👨‍🍳 3. Ichki tizim (Dashboard qismi - TO'LIQ HIMOYALANGAN)
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        // 🚀 ENDI DOIMIY SUPERADMIN EMAS, KIRGAN ROLGA QARAB AVTOMAT OTADI
        index: true,
        element: <DashboardIndexRedirect />,
      },

      // 👑 SUPERADMIN yo'llari
      {
        path: "superadmin",
        children: [
          { index: true, element: <SuperAdmin /> },
          { path: "tables", element: <SuperAdmin /> },
        ],
      },

      // 💼 MANAGER yo'llari (Sening haqiqiy layouting ulandi)
      {
        path: "manager",
        element: <ManagerLayout />, // 👈 Layoutingni shu yerga joyladik, sidebar va header endi ishlaydi
        children: [
          {
            index: true,
            element: (
              <div className="text-slate-400 font-mono text-sm">
                Manager Asosiy Sahifasi Ichki Kontenti
              </div>
            ),
          },
          // Kelajakda manager sahifalarini (Buyurtmalar, Mahsulotlar va h.k) shu yerga bolalar sifatida qo'shasan
        ],
      },

      // 🤵 WAITER (Ofitsiant) yo'llari (Kelajak uchun tayyor zaxira)
      {
        path: "waiter",
        children: [
          { index: true, element: <div>Ofitsiant Asosiy Sahifa</div> },
        ],
      },
    ],
  },

  // 🛑 4. Noto'g'ri havola kiritilganda har doim bosh sahifaga qaytarish
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
