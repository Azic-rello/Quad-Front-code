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
      {/* Manager */}
      <Route element={<AuthGuard roles={["MANAGER"]} />}>
        <Route path="manager" element={<ManagerSidebar />}>
          <Route
            index
            element={<div className="text-slate-400">Dashboard</div>}
          />

          <Route path="create-user" element={<div>Create User</div>} />

          <Route path="create-menu" element={<div>Create Menu</div>} />
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
