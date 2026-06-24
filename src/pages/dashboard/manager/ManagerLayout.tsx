import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ManagerSidebar from "./Components/ManagerSidebar";

interface LoggedInUser {
  id: string;
  name: string;
  username: string;
  role: string;
}

const ManagerLayout: React.FC = () => {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Xotiradan joriy kirgan managerni tekshiramiz
    const currentUser = localStorage.getItem("current_user");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    } else {
      // Agar ruxsatsiz kirmoqchi bo'lsa, uni superadminga qaytarib yuboramiz
      navigate("/dashboard/SuperAdmin");
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 font-mono text-sm">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-950 text-slate-100 min-h-screen relative">
      {/* Orqa fondagi yashirin kiber neon nur */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* 👑 Faqat menejerga tegishli katta Sidebar */}
      <ManagerSidebar />

      {/* Menejerning ishchi maydoni */}
      <div className="flex-1 flex flex-col h-full overflow-x-hidden overflow-y-auto bg-slate-950/40 backdrop-blur-sm z-10">
        {/* Yuqori Header - Premium To'q dizayn */}
        <header className="h-16 border-b border-slate-900 bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-8">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
            <h1 className="font-bold text-base uppercase tracking-wider text-slate-200">
              Menejer Boshqaruv Tizimi
            </h1>
          </div>

          {/* O'ng tarafdagi kichik ma'lumot */}
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-300">{user.name}</p>
            <p className="text-[10px] text-teal-400/60 font-mono">
              Status: Active
            </p>
          </div>
        </header>

        {/* Sahifalar yuklanadigan asosiy kontent qismi */}
        <main className="p-6 flex-1">
          {/* Menejerning pages papkasidagi sahifalari shu yerga tushadi */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
