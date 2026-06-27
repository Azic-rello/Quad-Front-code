import React from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../../../../modules/auth/authStore";

const ManagerSidebar: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="flex h-screen bg-slate-950">
      {/* ================= Sidebar ================= */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between fixed left-0 top-0 h-screen">
        <div className="p-5 space-y-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 px-2 py-3 border-b border-slate-800">
            <div className="w-8 h-8 bg-gradient-to-tr from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center font-bold text-slate-950">
              Q
            </div>

            <span className="font-black text-slate-100 uppercase">
              Quad Front
            </span>
          </div>

          {/* User */}
          {user && (
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
              <p className="text-xs text-teal-400">{user.role}</p>

              <h3 className="font-bold text-slate-200">
                {"name" in user ? (user as any).name : user.username}
              </h3>

              <p className="text-xs text-slate-500">@{user.username}</p>
            </div>
          )}

          {/* Menu */}
          <nav className="space-y-2">
            <a
              href="#"
              className="block px-4 py-3 rounded-lg bg-teal-600 text-white"
            >
              📊 Dashboard
            </a>

            <a
              href="#"
              className="block px-4 py-3 rounded-lg hover:bg-slate-800"
            >
              📦 Buyurtmalar
            </a>

            <a
              href="#"
              className="block px-4 py-3 rounded-lg hover:bg-slate-800"
            >
              👨‍🎓 O'quvchilar
            </a>

            <a
              href="#"
              className="block px-4 py-3 rounded-lg hover:bg-slate-800"
            >
              👨‍🏫 Mentorlar
            </a>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-5 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ================= Right Side ================= */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
          <h1 className="text-white text-lg font-bold">Manager Dashboard</h1>

          <div className="text-slate-300">👋 {user?.username}</div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManagerSidebar;
