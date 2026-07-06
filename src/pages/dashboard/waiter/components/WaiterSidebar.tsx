import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Grid, Home, LogOut, Menu, UserCheck, X, Utensils } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../../../modules/auth/authStore";

const WaiterSidebar: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#faf9f6] text-stone-800 overflow-hidden">
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed left-0 top-0 z-50 h-screen w-64 bg-[#140b0b]
        flex flex-col justify-between
        transition-transform duration-300
        lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 py-3">
            <div className="w-10 h-10 rounded-full bg-[#e31221] flex items-center justify-center shadow-lg">
              <Utensils className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="text-white font-bold text-lg">
                Burger<span className="text-[#e31221]">Uz</span>
              </h1>

              <p className="text-xs text-stone-400">Waiter Panel</p>
            </div>
          </div>

          {/* Menu */}
   <nav className="space-y-2">
  <NavLink
    to="/waiter/tables" // Routeringdagi aniq yo'l
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive
          ? "bg-[#e31221] text-white"
          : "text-stone-400 hover:bg-[#221313] hover:text-white"
      }`
    }
  >
    <Grid className="w-5 h-5" />
    <span>Stollar</span> {/* 🛠 <a> tegi olib tashlandi, o'rniga span qo'yildi */}
  </NavLink>
</nav>
        </div>

        {/* Bottom */}
        <div className="border-t border-stone-800 bg-[#0d0707] p-4 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#1b1010]">
            <UserCheck className="w-5 h-5 text-[#e31221]" />

            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">
                {user?.username}
              </p>

              <p className="text-xs text-stone-400 uppercase">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-400 hover:bg-[#221313] hover:text-white transition"
          >
            <Home className="w-4 h-4" />
            Home
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-400 hover:bg-[#221313] hover:text-white transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-stone-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <h1 className="font-bold text-lg text-stone-800">
              Waiter Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-stone-100 px-4 py-2 rounded-full">
            <UserCheck className="w-4 h-4 text-[#e31221]" />

            <span className="font-medium text-sm">{user?.username}</span>
          </div>
        </header>

        {/* Pages */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#faf9f6]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default WaiterSidebar;
