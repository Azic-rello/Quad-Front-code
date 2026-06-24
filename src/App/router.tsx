import { createBrowserRouter, Navigate } from "react-router-dom";

// 🏢 Layoutlar
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// 📄 Public (Mijoz) sahifalari
import AboutLayout from "../pages/public/About/AboutLayout";
import BasketLayout from "../pages/public/Basket/BasketLayout";
import HomeLayout from "../pages/public/Home/HomeLayout";
import MenuLayout from "../pages/public/Menu/MenuLayout";
import NewsLayout from "../pages/public/News/NewsLayout";

// 🔐 Auth sahifalari
import Login from "../pages/auth/Login";

// 🛡️ Guards (Siz aytgan himoya qatlami)
import ProtectedRoute from "../components/guards/ProtectedRoute";
import GuestRoute from "../components/guards/GuestRoute";

// 👨‍🍳 Dashboard (Ichki tizim) sahifalari
const WaiterTables = () => (
  <div className="p-8">🍽️ Ofitsiant uchun Stol paneli</div>
);

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

  // 🔐 2. AVTORIZATSIYA (Faqat tizimga kirmagan mehmonlar kirishi mumkin)
  {
    path: "/auth",
    element: <GuestRoute />, // 👈 Tizimga kirganlar login sahifasiga qayta kira olmaydi
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: "login", element: <Login /> },
    ],
  },

  // 🔄 Eski yo'lni yangisiga yo'naltirish
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
    ), // 👈 Token bo'lmasa, ichki sahifalarning birontasiga ham o'tkazmaydi
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/waiter/tables" replace />,
      },
      {
        path: "waiter",
        children: [{ path: "tables", element: <WaiterTables /> }],
      },
      /* Kelajakda faqat Admin ko'rishi kerak bo'lgan yo'llar bo'lsa, bunday yozasiz:
         {
           path: "admin",
           element: <ProtectedRoute allowedRoles={['ADMIN']} />,
           children: [ ... ]
         }
      */
    ],
  },
  {
    // 🛑 4. Noto'g'ri havola kiritilganda bosh sahifaga qaytarish
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
