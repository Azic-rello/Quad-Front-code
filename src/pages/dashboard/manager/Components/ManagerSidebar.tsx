import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Menu,
  X,
  UserCheck,
  Home,
  LogOut,
  UtensilsCrossed,
  Layers,
  Users, // 👈 Ofitsiantlar uchun ikonka qo'shildi
} from "lucide-react";
import { useAuthStore } from "../../../../modules/auth/authStore";

const ManagerSidebar: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // Mobil menyu holati uchun state
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#faf9f6] text-stone-800 font-sans antialiased overflow-hidden">
      {/* ================= Mobil uchun Orqa Fon (Overlay) ================= */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ================= Sidebar ================= */}
      <aside
        className={`
        fixed left-0 top-0 z-50 h-screen w-64 bg-[#140b0b] text-stone-300
        flex flex-col justify-between transform transition-transform duration-300 ease-out
        lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-4 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Logo */}
          <div className="flex items-center space-x-3 px-2 py-3">
            <div className="w-9 h-9 bg-[#e31221] rounded-full flex items-center justify-center font-black text-white shadow-md">
              🍔
            </div>
            <span className="font-bold text-white tracking-wide text-sm uppercase">
              Quad Pizza
            </span>
          </div>

          {/* Navigatsiya Menyusi (To'g'ri NavLink routerlari bilan) */}
          <nav className="space-y-1">
            {/* 1. Dashboard */}
            <NavLink
              to="/manager"
              end
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#e31221] text-white"
                    : "text-stone-400 hover:text-stone-100 hover:bg-[#221313]"
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5 opacity-90" />
              <span>Dashboard</span>
            </NavLink>

            {/* 2. Buyurtmalar */}
            <NavLink
              to="/manager/buyurtmalar"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#e31221] text-white"
                    : "text-stone-400 hover:text-stone-100 hover:bg-[#221313]"
                }`
              }
            >
              <ShoppingBag className="w-5 h-5 opacity-80" />
              <span>Buyurtmalar</span>
            </NavLink>

            {/* 3. Menyu */}
            <NavLink
              to="/manager/create-menu"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#e31221] text-white"
                    : "text-stone-400 hover:text-stone-100 hover:bg-[#221313]"
                }`
              }
            >
              <UtensilsCrossed className="w-5 h-5 opacity-80" />
              <span>Menyu</span>
            </NavLink>

            {/* 4. Kategoriyalar */}
            <NavLink
              to="/manager/category"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#e31221] text-white"
                    : "text-stone-400 hover:text-stone-100 hover:bg-[#221313]"
                }`
              }
            >
              <Layers className="w-5 h-5 opacity-80" />
              <span>Kategoriyalar</span>
            </NavLink>

            {/* 5. Ofitsiantlar (Yangi qo'shilgan qism) */}
            <NavLink
              to="/manager/waiters"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#e31221] text-white"
                    : "text-stone-400 hover:text-stone-100 hover:bg-[#221313]"
                }`
              }
            >
              <Users className="w-5 h-5 opacity-80" />
              <span>Ofitsiantlar</span>
            </NavLink>
          </nav>
        </div>

        {/* Pastki tugmalar qismi (Bosh sahifa va Chiqish) */}
        <div className="p-4 border-t border-stone-800/60 bg-[#0d0707] space-y-1">
          {/* Bosh sahifa tugmasi */}
          <button
            onClick={() => navigate("/")}
            className="w-full py-2.5 flex items-center space-x-3 px-4 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800/40 font-medium transition-all duration-200"
          >
            <Home className="w-4 h-4 opacity-80" />
            <span>Bosh sahifa</span>
          </button>

          {/* Chiqish tugmasi */}
          <button
            onClick={logout}
            className="w-full py-2.5 flex items-center space-x-3 px-4 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800/40 font-medium transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* ================= O'ng tomon (Asosiy Kontent) ================= */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-stone-200/80 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-3">
            {/* Mobil uchun Burger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 lg:hidden active:scale-95 transition-all"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <h1 className="text-stone-900 text-base sm:text-lg font-bold tracking-tight">
              Manager Dashboard
            </h1>
          </div>

          {/* User Greeting */}
          <div className="flex items-center space-x-2.5 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-full text-xs sm:text-sm text-stone-600 shadow-sm">
            <UserCheck className="w-4 h-4 text-[#e31221]" />
            <span className="max-w-[120px] sm:max-w-none truncate font-medium text-stone-700">
              {user?.username || "jahon"}
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#faf9f6] custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerSidebar;