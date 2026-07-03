import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import ManagerSidebar from "./Components/ManagerSidebar";
import { useAuthStore } from "../../../modules/auth/authStore";

const ManagerLayout: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  // 🎯 TUZATISH: Prisma enumi katta harflarda ("MANAGER") bo'lgani uchun tekshiruvni o'zgartirdik
  if (!user || user.role !== "MANAGER") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-950 text-slate-100 min-h-screen relative">
      {/* Orqa fondagi yashirin kiber neon nur */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar */}
      <ManagerSidebar />

      {/* Asosiy kontent */}
      <div className="flex-1 flex flex-col h-full overflow-x-hidden overflow-y-auto bg-slate-950/40 backdrop-blur-sm z-10">
        {/* Header */}
        <header className="h-16 border-b border-slate-900 bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-8">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
            <h1 className="font-bold text-base uppercase tracking-wider text-slate-200">
              Menejer Boshqaruv Tizimi
            </h1>
          </div>

          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-300">
              {user.username} {/* 👈 any kastingi olib tashlandi va tiplar tozalandi */}
            </p>
            <p className="text-[10px] text-teal-400/60 font-mono">
              Status: Active
            </p>
          </div>
        </header>

        {/* Sahifalar */}
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;