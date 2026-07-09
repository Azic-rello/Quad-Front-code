import { useEffect, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Layouts
import PublicLayout from "@/layouts/PublicLayout";

// Public Pages
import HomeLayout from "@/pages/public/Home/HomeLayout";
import MenuLayout from "@/pages/public/Menu/MenuLayout";
import NewsLayout from "@/pages/public/News/NewsLayout";
import AboutLayout from "@/pages/public/About/AboutLayout";
import BasketLayout from "@/pages/public/Basket/BasketLayout";

// Auth & Admin
import Login from "@/pages/auth/Login";
import SuperAdmin from "@/pages/dashboard/SuperAdmin/SuperAdmin";

// Manager Components
import ManagerSidebar from "@/pages/dashboard/manager/Components/ManagerSidebar";
import Dashboard from "@/pages/dashboard/manager/Components/dashboard/Dashboard";
import { ProductList } from "@/pages/dashboard/manager/Components/products/components/ProductList";
import WaitersPage from "@/pages/dashboard/manager/Components/waiter/WaitersPage";
import TablesPage from "@/pages/dashboard/manager/Components/Tables/TablesPage";
import LiveOrder from "@/pages/dashboard/manager/Components/liveorder/LiveOrder";
import News from "@/pages/dashboard/manager/Components/News/News";

// Order Module (Manager)
import { OrdersList } from "@/pages/dashboard/manager/Components/orderj/OrdersList";
import { OrderDetails } from "@/pages/dashboard/manager/Components/orderj/OrderDetails";
import { CreateOrder } from "@/pages/dashboard/manager/Components/orderj/CreateOrder";

// Waiter Components
import WaiterSidebar from "@/pages/dashboard/waiter/components/WaiterSidebar";
import WaiterTables from "@/pages/dashboard/waiter/components/WaiterTables";

// Guards & Hooks
import AuthGuard from "@/components/guards/AuthGuard";
import { useLoader } from "@/components/shared/Loader";
import WaiterOrderPage from "@/pages/dashboard/manager/Components/orderj/WaiterOrderPage";

function App() {
  const location = useLocation();
  const { showLoader, hideLoader } = useLoader();

  const prevPathname = useRef(location.pathname);

  useEffect(() => {
    if (prevPathname.current !== location.pathname) {
      showLoader("Sahifa yuklanmoqda...");

      const timer = setTimeout(() => {
        hideLoader();
      }, 400);

      prevPathname.current = location.pathname;
      return () => clearTimeout(timer);
    }
  }, [location.pathname, showLoader, hideLoader]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomeLayout />} />
        <Route path="menu" element={<MenuLayout />} />
        <Route path="news" element={<NewsLayout />} />
        <Route path="about" element={<AboutLayout />} />
        <Route path="basket" element={<BasketLayout />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/auth">
        <Route index element={<Navigate to="/auth/login" replace />} />
        <Route path="login" element={<Login />} />
      </Route>
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />

      {/* SuperAdmin Route */}
      <Route path="/admin" element={<SuperAdmin />} />

      {/* Manager Routes */}
      <Route element={<AuthGuard roles={["MANAGER"]} />}>
        <Route path="manager" element={<ManagerSidebar />}>
          <Route index element={<Dashboard />} />
          
          <Route path="menu" element={<ProductList />} />
          <Route path="waiters" element={<WaitersPage />} />
          <Route path="tables" element={<TablesPage />} />
          <Route path="liveOrder" element={<LiveOrder />} />
          <Route path="news" element={<News />} />
          
          {/* Order Module Routes */}
          <Route path="orders" element={<OrdersList />} />
          <Route path="orders/create" element={<CreateOrder />} />
          <Route path="orders/:id" element={<OrderDetails />} />
        </Route>
      </Route>

      {/* Waiter Routes */}
      <Route element={<AuthGuard roles={["WAITER"]} />}>
        <Route path="waiter" element={<WaiterSidebar />}>
          <Route index element={<WaiterTables />} />
          {/* ✅ orderId optional parametir sifatida qo'shildi */}
          <Route path="order/:tableId/:orderId?" element={<WaiterOrderPage />} />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;