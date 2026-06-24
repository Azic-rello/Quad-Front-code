import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Flame,
  Users,
  Grid,
  Utensils,
  Newspaper,
  Home,
  LogOut,
} from "lucide-react";

const ManagerSidebar: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Overview",
      path: "/dashboard/manager/overview",
      icon: LayoutDashboard,
    },
    { name: "Live Orders", path: "/dashboard/manager/orders", icon: Flame },
    { name: "Waiters", path: "/dashboard/manager/waiters", icon: Users },
    { name: "Tables", path: "/dashboard/manager/tables", icon: Grid },
    { name: "Menu", path: "/dashboard/manager/foods", icon: Utensils },
    { name: "News", path: "/dashboard/manager/news", icon: Newspaper },
  ];

  const handleSignOut = () => {
    // Tokenlarni o'chirish va login sahifasiga qaytarish mantiqi
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-64 h-full bg-[#120808] text-white flex flex-col justify-between p-4 border-r border-zinc-800/40 select-none">
      {/* Yuqori qism: Brend va Logo */}
      <div>
        <div className="flex items-center space-x-3 px-3 py-4 mb-6">
          <div className="w-10 h-10 bg-[#E30A17] rounded-full flex items-center justify-center shadow-lg shadow-red-600/20">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wide flex items-center">
              Burger<span className="text-[#E30A17]">Uz</span>
            </h1>
            <p className="text-xs text-zinc-400">Overview</p>
          </div>
        </div>

        {/* O'rtadagi asosiy navigatsiya havolalari */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#E30A17] text-white shadow-md shadow-red-600/10 font-semibold"
                      : "text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Pastki qism: Profil va Tizimdan chiqish */}
      <div className="border-t border-zinc-800/60 pt-4 space-y-2">
        <div className="px-4 py-2">
          <p className="text-xs text-zinc-500 font-medium">Manager • manager</p>
        </div>

        {/* Home tugmasi */}
        <NavLink
          to="/"
          className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-zinc-400 hover:bg-zinc-900/50 hover:text-white transition-all font-medium text-sm"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </NavLink>

        {/* Sign Out tugmasi */}
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

export default ManagerSidebar;
