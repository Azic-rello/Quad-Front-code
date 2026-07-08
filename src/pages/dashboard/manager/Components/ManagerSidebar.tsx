import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Menu,
  X,
  UserCheck,
  Home,
  LogOut,
  UtensilsCrossed,
  Users,
  Table2,
  ClipboardList,
  Newspaper,
} from "lucide-react";
import { useAuthStore } from "../../../../modules/auth/authStore";

const ManagerSidebar: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  // Mobil menyu holati uchun state
  const [isOpen, setIsOpen] = useState(false);

  // Hozirgi sahifa nomini aniqlash (Logotip tagida ko'rinishi uchun)
  const getSubTitle = () => {
    if (location.pathname === "/manager") return "Overview";
    if (location.pathname.includes("menu")) return "Menu";
    if (location.pathname.includes("waiters")) return "Waiters";
    if (location.pathname.includes("tables")) return "Tables";
    if (location.pathname.includes("liveOrder")) return "Live order";
    if (location.pathname.includes("news")) return "News";
    return "Management";
  };

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
        fixed left-0 top-0 z-50 h-screen w-64 bg-[#1a0f0f] text-stone-300
        flex flex-col justify-between transform transition-transform duration-300 ease-out border-r border-stone-900
        lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-4 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Logo - Rasmdagi kabi tepada brend va tagida sahifa nomi */}
          <div className="flex items-center space-x-3 px-2 py-2">
            <div className="w-9 h-9 bg-[#e31221] rounded-full flex items-center justify-center font-black text-white shadow-md">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-base leading-none tracking-wide">
                Quad <span className="text-[#E31221]">pizza</span>
              </span>
              <span className="text-xs text-stone-500 font-medium mt-0.5">
                {getSubTitle()}
              </span>
            </div>
          </div>

          {/* Navigatsiya Menyusi */}
          <nav className="space-y-1.5 pt-2">
            {/* 1. Dashboard / Overview */}
            <NavLink
              to="/manager"
              end
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#e31221] text-white shadow-lg shadow-red-900/20"
                    : "text-stone-400 hover:text-stone-100 hover:bg-[#251616]"
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5 opacity-90" />
              <span>Overview</span>
            </NavLink>
            {/* 3. Menyu */}
            <NavLink
              to="/manager/menu"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? "bg-[#e31221] text-white" : "text-stone-400 hover:text-stone-100 hover:bg-[#221313]"}`
              }
            >
              <UtensilsCrossed className="w-5 h-5 opacity-80" />
              <span>Menyu</span>
            </NavLink>
            <NavLink
              to="/manager/waiters"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#e31221] text-white shadow-lg shadow-red-900/20"
                    : "text-stone-400 hover:text-stone-100 hover:bg-[#251616]"
                }`
              }
            >
              <Users className="w-5 h-5 opacity-80" />
              <span>Waiters</span>
            </NavLink>

            {/* 3. Tables / Stollar */}
            <NavLink
              to="/manager/tables"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#e31221] text-white shadow-lg shadow-red-900/20"
                    : "text-stone-400 hover:text-stone-100 hover:bg-[#251616]"
                }`
              }
            >
              <Table2 className="w-5 h-5 opacity-80" />
              <span>Tables</span>
            </NavLink>
            <NavLink
              to="/manager/liveOrder"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#e31221] text-white shadow-lg shadow-red-900/20"
                    : "text-stone-400 hover:text-stone-100 hover:bg-[#251616]"
                }`
              }
            >
              <ClipboardList className="w-5 h-5 opacity-80" />
              <span>Live Orders</span>
            </NavLink>
            <NavLink
              to="/manager/news"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#e31221] text-white shadow-lg shadow-red-900/20"
                    : "text-stone-400 hover:text-stone-100 hover:bg-[#251616]"
                }`
              }
            >
              <Newspaper className="w-5 h-5 opacity-80" />
              <span>News</span>
            </NavLink>
          </nav>
        </div>

        {/* Pastki qism - Rasmdagi kabi kichik rol yozuvi va tugmalar */}
        <div className="p-4 border-t border-stone-900 bg-[#120a0a] space-y-2">
          <div className="px-4 py-1 text-[11px] text-stone-500 font-medium tracking-wider uppercase">
            Manager • {user?.username || "manager"}
          </div>

          {/* Bosh sahifa tugmasi */}
          <button
            onClick={() => navigate("/")}
            className="w-full py-2 flex items-center space-x-3 px-4 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800/30 text-sm font-medium transition-all duration-200"
          >
            <Home className="w-4 h-4 opacity-70" />
            <span>Home</span>
          </button>

          {/* Chiqish tugmasi */}
          <button
            onClick={logout}
            className="w-full py-2 flex items-center space-x-3 px-4 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800/30 text-sm font-medium transition-all duration-200"
          >
            <LogOut className="w-4 h-4 opacity-70" />
            <span>Sign Out</span>
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

            <h1 className="text-stone-900 text-base sm:text-lg font-bold tracking-tight uppercase">
              {getSubTitle()}
            </h1>
          </div>

          {/* User Greeting */}
          <div className="flex items-center space-x-2.5 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-full text-xs sm:text-sm text-stone-600 shadow-sm">
            <UserCheck className="w-4 h-4 text-[#e31221]" />
            <span className="max-w-30 sm:max-w-none truncate font-medium text-stone-700">
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
