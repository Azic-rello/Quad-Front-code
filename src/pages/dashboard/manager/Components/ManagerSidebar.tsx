import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../../../../modules/auth/authStore";
// Zamonaviy va chiroyli ikonkalarni olib kiramos
import {
  LayoutDashboard,
  ShoppingBag,
  GraduationCap,
  Users,
  LogOut,
  Menu,
  X,
  UserCheck,
} from "lucide-react";

const ManagerSidebar: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Mobil menyu holati uchun state
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
      {/* ================= Mobil uchun Orqa Fon (Overlay) ================= */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ================= Sidebar ================= */}
      <aside
        className={`
        fixed left-0 top-0 z-50 h-screen w-64 bg-slate-900/90 backdrop-blur-md border-r border-slate-800/60 
        flex flex-col justify-between transform transition-transform duration-300 ease-out
        lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-5 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Logo */}
          <div className="flex items-center space-x-3 px-2 py-3 border-b border-slate-800/50">
            <div className="w-9 h-9 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-xl flex items-center justify-center font-black text-slate-950 shadow-lg shadow-teal-500/20 transform hover:rotate-12 transition-transform duration-300">
              Q
            </div>
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 tracking-wider text-sm uppercase">
              Quad Front
            </span>
          </div>

          {/* User Profile */}
          {user && (
            <div className="bg-gradient-to-b from-slate-950/40 to-slate-950/80 border border-slate-800/80 p-4 rounded-xl shadow-inner group hover:border-slate-700/60 transition-all duration-300">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-2 uppercase tracking-wider">
                {user.role}
              </span>
              <h3 className="font-semibold text-slate-200 truncate group-hover:text-teal-400 transition-colors duration-300">
                {"name" in user ? (user as any).name : user.username}
              </h3>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                @{user.username}
              </p>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            <a
              href="#"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium shadow-lg shadow-teal-600/10 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <LayoutDashboard className="w-5 h-5 opacity-90" />
              <span>Dashboard</span>
            </a>

            <a
              href="#"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 group transform hover:translate-x-1 active:scale-[0.98] transition-all duration-200"
            >
              <ShoppingBag className="w-5 h-5 text-slate-500 group-hover:text-teal-400 transition-colors" />
              <span>Buyurtmalar</span>
            </a>

            <a
              href="#"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 group transform hover:translate-x-1 active:scale-[0.98] transition-all duration-200"
            >
              <GraduationCap className="w-5 h-5 text-slate-500 group-hover:text-teal-400 transition-colors" />
              <span>O'quvchilar</span>
            </a>

            <a
              href="#"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 group transform hover:translate-x-1 active:scale-[0.98] transition-all duration-200"
            >
              <Users className="w-5 h-5 text-slate-500 group-hover:text-teal-400 transition-colors" />
              <span>Mentorlar</span>
            </a>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-5 border-t border-slate-800/50 bg-slate-900/50">
          <button
            onClick={logout}
            className="w-full py-3 flex items-center justify-center space-x-2 rounded-xl bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-transparent text-red-400 hover:text-white font-medium shadow-sm active:scale-[0.98] transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* ================= O'ng tomon (Asosiy Kontent) ================= */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/60 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-3">
            {/* Mobil uchun Burger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 lg:hidden active:scale-95 transition-all"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <h1 className="text-slate-100 text-base sm:text-lg font-bold tracking-tight">
              Manager Dashboard
            </h1>
          </div>

          {/* User Greeting */}
          <div className="flex items-center space-x-2.5 bg-slate-950/40 border border-slate-800/60 px-3 py-1.5 rounded-full text-xs sm:text-sm text-slate-300 shadow-sm group hover:border-slate-700 transition-colors duration-300">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span className="max-w-[120px] sm:max-w-none truncate font-medium text-slate-200">
              {user?.username}
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerSidebar;
