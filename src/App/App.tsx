import { Routes, Route, Navigate } from "react-router-dom";

// 🏢 Layoutlar
import PublicLayout from "../layouts/PublicLayout";

// 📄 Public
import HomeLayout from "../pages/public/Home/HomeLayout";
import MenuLayout from "../pages/public/Menu/MenuLayout";
import NewsLayout from "../pages/public/News/NewsLayout";
import AboutLayout from "../pages/public/About/AboutLayout";
import BasketLayout from "../pages/public/Basket/BasketLayout";

// 🔐 Auth
import Login from "../pages/auth/Login";

// Dashboard
import SuperAdmin from "../pages/dashboard/SuperAdmin/SuperAdmin";
import ManagerSidebar from "../pages/dashboard/manager/Components/ManagerSidebar";
import AuthGuard from "../components/guards/AuthGuard";

// 📂 Category komponentlari
import CreatCategory from "../pages/dashboard/manager/Components/Category/creatcategory";
import WaitersPage from "../pages/dashboard/manager/Components/waiter/WaitersPage";
import WaiterSidebar from "../pages/dashboard/waiter/components/WaiterSidebar";

// 👥 Ofitsiantlar paneli sahifasi

function App() {
  return (
    <Routes>
      {/* 🌍 Public */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomeLayout />} />
        <Route path="menu" element={<MenuLayout />} />
        <Route path="news" element={<NewsLayout />} />
        <Route path="about" element={<AboutLayout />} />
        <Route path="basket" element={<BasketLayout />} />
      </Route>

      {/* 🔐 Login */}
      <Route path="/auth">
        <Route index element={<Navigate to="/auth/login" replace />} />
        <Route path="login" element={<Login />} />
      </Route>

      <Route path="/login" element={<Navigate to="/auth/login" replace />} />

      <Route path="/admin" element={<SuperAdmin />} />

      {/* 🏢 Manager Dashboard */}
      <Route element={<AuthGuard roles={["MANAGER"]} />}>
        <Route path="manager" element={<ManagerSidebar />}>
          {/* 1. Dashboard Asosiy Sahifa */}
          <Route
            index
            element={<div className="text-slate-400 font-medium">Dashboard sahifasi</div>}
          />

          {/* 3. Menyu (Menu) bo'limi */}

          <Route path="menu" element={<div className="text-stone-800 font-medium">Menyu ro'yxati sahifasi</div>} />
          <Route path="create-menu" element={ <div>menu</div>} />

          {/* 4. Category (Kategoriya) bo'limi */}
          <Route path="category" element={<CreatCategory />} />

          {/* 5. Ofitsiantlar (Waiters) boshqaruv sahifasi */}
          <Route path="waiters" element={<WaitersPage />} />

        </Route>
      </Route>

      {/* Waiter */}
      <Route path="waiter">
        <Route index element={<WaiterSidebar/>} />
      </Route>

      {/* ❌ 404 (Topilmagan sahifalar uchun default yo'naltirish) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;