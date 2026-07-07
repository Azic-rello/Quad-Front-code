import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

import HomeLayout from "../pages/public/Home/HomeLayout";
import MenuLayout from "../pages/public/Menu/MenuLayout";
import NewsLayout from "../pages/public/News/NewsLayout";
import AboutLayout from "../pages/public/About/AboutLayout";
import BasketLayout from "../pages/public/Basket/BasketLayout";

import Login from "../pages/auth/Login";

import SuperAdmin from "../pages/dashboard/SuperAdmin/SuperAdmin";
import ManagerSidebar from "../pages/dashboard/manager/Components/ManagerSidebar";
import AuthGuard from "../components/guards/AuthGuard";

import WaitersPage from "../pages/dashboard/manager/Components/waiter/WaitersPage";
import WaiterSidebar from "../pages/dashboard/waiter/components/WaiterSidebar";

import { ProductList } from "@/pages/dashboard/manager/Components/products/components/ProductList";
import CategoriesManagementPage from "@/pages/dashboard/manager/Components/Category/CategoriesPage";
import TablesPage from "@/pages/dashboard/manager/Components/Tables/TablesPage";
import WaiterTables from "@/pages/dashboard/waiter/components/WaiterTables";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomeLayout />} />
        <Route path="menu" element={<MenuLayout />} />
        <Route path="news" element={<NewsLayout />} />
        <Route path="about" element={<AboutLayout />} />
        <Route path="basket" element={<BasketLayout />} />
      </Route>

      <Route path="/auth">
        <Route index element={<Navigate to="/auth/login" replace />} />
        <Route path="login" element={<Login />} />
      </Route>

      <Route path="/login" element={<Navigate to="/auth/login" replace />} />

      <Route path="/admin" element={<SuperAdmin />} />

      <Route element={<AuthGuard roles={["MANAGER"]} />}>
        <Route path="manager" element={<ManagerSidebar />}>
          
          {/* 1. Dashboard Asosiy Sahifa */}

          <Route
            index
            element={
              <div className="text-slate-400 font-medium">
                Dashboard sahifasi
              </div>
            }
          />

          <Route path="menu" element={<ProductList/>} />
          <Route path="category" element={<CategoriesManagementPage />} />
          <Route path="waiters" element={<WaitersPage />} />
          <Route path="tables" element={<TablesPage />} />
          <Route path="katagory" element={<CategoriesManagementPage />} />

          <Route path="create-user" element={<div>Create User</div>} />
        </Route>
      </Route>

      <Route element={<AuthGuard roles={["WAITER"]} />}>
        <Route path="waiter/tables" element={<WaiterSidebar />}>
          <Route index path="tables" element={<WaiterTables />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
