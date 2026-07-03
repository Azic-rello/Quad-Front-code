import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import WaiterSidebar from "./components/WaiterSidebar";
import { useAuthStore } from "../../../modules/auth/authStore";

const WaiterLayout: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  // Faqat WAITER kirishi mumkin
  if (!user || user.role !== "WAITER") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#faf9f6] min-h-screen relative">
      {/* Background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar */}
      <WaiterSidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col h-full overflow-x-hidden overflow-y-auto lg:ml-64 relative z-10">
        {/* Header */}
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#e31221] animate-pulse" />

            <h1 className="font-bold text-stone-800 tracking-wide">
              Waiter Dashboard
            </h1>
          </div>

          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-stone-700">
              {user.username}
            </p>

            <p className="text-xs text-[#e31221] uppercase">{user.role}</p>
          </div>
        </header>

        {/* Pages */}
        <main className="flex-1 p-6 overflow-y-auto bg-[#faf9f6]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default WaiterLayout;
