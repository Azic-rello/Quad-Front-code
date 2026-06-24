import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoggedInUser {
  name: string;
  username: string;
  role: string;
}

const ManagerSidebar: React.FC = () => {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem("current_user");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("current_user"); // Tizimdan chiqish
    navigate("/dashboard/SuperAdmin"); // Super admin panelga qaytarish
  };

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-5 h-screen text-slate-300">
      {/* Yuqori qism: Logo va Profil */}
      <div className="space-y-6">
        {/* Tizim Logosi */}
        <div className="flex items-center space-x-3 px-2 py-3 border-b border-slate-800/60">
          <div className="w-8 h-8 bg-gradient-to-tr from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center font-bold text-slate-950 text-sm">
            Q
          </div>
          <span className="font-black text-slate-100 tracking-wider text-sm uppercase">
            Quad Front
          </span>
        </div>

        {/* Kirgan Manager Ma'lumotlari Card ko'rinishida */}
        {user && (
          <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-[9px] text-teal-400 font-mono uppercase tracking-widest">
                {user.role}
              </span>
            </div>
            <h3 className="text-xs font-bold text-slate-200 truncate">
              {user.name}
            </h3>
            <p className="text-[10px] text-slate-500 font-mono truncate">
              @{user.username}
            </p>
          </div>
        )}

        {/* Sidebar Navigatsiya Menyulari (Bunga kelajakda boshqa sahifalar havolalarini qo'shasan) */}
        <nav className="space-y-1">
          <p className="text-[9px] text-slate-600 font-mono uppercase tracking-wider px-2 mb-2">
            Asosiy Menyular
          </p>
          <a
            href="#dash"
            className="flex items-center space-x-3 px-3 py-2.5 bg-teal-500/10 text-teal-400 rounded-xl text-xs font-medium border border-teal-500/10"
          >
            <span>📊</span>
            <span>Dashboard</span>
          </a>
          <a
            href="#orders"
            className="flex items-center space-x-3 px-3 py-2.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-medium transition-colors"
          >
            <span>📦</span>
            <span>Buyurtmalar</span>
          </a>
        </nav>
      </div>

      {/* Pastki qism: Tizimdan chiqish (SuperAdminga Qaytish) */}
      <div className="border-t border-slate-800/60 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 py-2.5 bg-slate-950 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 rounded-xl text-xs font-medium transition-all duration-200 border border-slate-800 hover:border-rose-900/30 font-mono"
        >
          <span>← QUIT CORE</span>
        </button>
      </div>
    </div>
  );
};

export default ManagerSidebar;
