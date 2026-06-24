import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Grid, Home, LogOut, Utensils } from "lucide-react";

const WaiterSidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-64 h-full bg-[#120808] text-white flex flex-col justify-between p-4 border-r border-zinc-800/40 select-none shrink-0">
      {/* Yuqori qism: Logo va Sarlavha */}
      <div>
        <div className="flex items-center space-x-3 px-3 py-4 mb-6">
          <div className="w-10 h-10 bg-[#E30A17] rounded-full flex items-center justify-center shadow-lg shadow-red-600/20">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wide flex items-center">
              Burger<span className="text-[#E30A17]">Uz</span>
            </h1>
            <p className="text-xs text-zinc-400">Tables</p>
          </div>
        </div>

        {/* Navigatsiya Havolalari */}
        <nav className="space-y-1">
          <NavLink
            to="/dashboard/waiter/tables"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#E30A17] text-white shadow-md shadow-red-600/10 font-semibold"
                  : "text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
              }`
            }
          >
            <Grid className="w-5 h-5" />
            <span>Tables</span>
          </NavLink>
        </nav>
      </div>

      {/* Pastki qism: Profil, Home va Chiqish */}
      <div className="border-t border-zinc-800/60 pt-4 space-y-2">
        <div className="px-4 py-2">
          <p className="text-xs text-zinc-500 font-medium">Aziz • waiter</p>
        </div>

        {/* Bosh sahifaga qaytish */}
        <NavLink
          to="/"
          className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-zinc-400 hover:bg-zinc-900/50 hover:text-white transition-all font-medium text-sm"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </NavLink>

        {/* Tizimdan chiqish */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-zinc-400 hover:bg-red-950/30 hover:text-red-400 transition-all font-medium text-sm text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default WaiterSidebar;
