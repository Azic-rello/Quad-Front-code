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

// 📂 Category komponentlari (Siz yuborgan aniq fayl yo'llari bo'yicha)
import CategoryLoyaut from "../pages/public/Category/categoryloyaut";
import CreatCategory from "../pages/public/Category/creatcategory";
import CategoryDelete from "../pages/public/Category/Categorydelete";

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
            element={<div className="text-slate-400">Dashboard</div>}
          />

          {/* 2. Buyurtmalar (Orders) */}
          <Route
            path="buyurtmalar"
            element={<div className="text-white">Buyurtmalar sahifasi</div>}
          />

          {/* 3. Menyu (Menu) bo'limi */}
          <Route path="menu" element={<div>Menyu ro'yxati sahifasi</div>} />
          {/* Senda rasmda ishlab turgan yo'l mana shu: /manager/create-menu */}
          <Route path="create-menu" element={<div>menu page</div>} />

          {/* 4. Category (Kategoriya) bo'limi - Xuddi yuqoridagi Menyu kabi yozildi */}
          {/* /manager/category yozilganda to'g'ridan-to'g'ri Kategoriya yaratish ochiladi */}
          <Route path="category" element={<CreatCategory />} />
          <Route path="category-layout" element={<CategoryLoyaut />} />
          <Route path="category-delete" element={<CategoryDelete />} />

          {/* Eski keraksiz route */}
          <Route path="create-user" element={<div>Create User</div>} />
        </Route>
      </Route>

      {/* Waiter */}
      <Route path="waiter">
        <Route index element={<div>Ofitsiant Asosiy Sahifa</div>} />
      </Route>

      {/* ❌ 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
