import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Globe,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
// Auth store olib kiriladi, tokenni tekshirish va logout qilish uchun
import { useAuthStore } from "../../modules/auth/authStore";
import logo from "../../assets/logo.png";

// Tillari ro'yxati
const LANGUAGES = [
  { code: "UZ", name: "O'zbekcha" },
  { code: "RU", name: "Русский" },
  { code: "EN", name: "English" },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Mobil menyu holati

  // 🌐 Global Auth holatlarini olamiz
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // 🌐 Til tanlash shtatlari
  const [currentLang, setCurrentLang] = useState("UZ");
  const [isLangOpen, setIsLangOpen] = useState(false); // Kompyuter til menyusi
  const [isMobLangOpen, setIsMobLangOpen] = useState(false); // Mobil til menyusi

  const langDropdownRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => {
    setIsOpen(false);
    setIsMobLangOpen(false);
  };
  const handleDashboard = () => {
    if (!user) return;

    switch (user.role) {
      case "MANAGER":
        navigate("/manager");
        break;

      case "WAITER":
        navigate("/waiter");
        break;

      default:
        navigate("/");
        break;
    }

    closeMenu();
  };

  // Kompyuter til menyusidan tashqariga bosganda yopish
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="w-full h-20 bg-white border-b border-gray-100 sticky top-0 z-50 px-4 sm:px-6 lg:px-16 flex items-center justify-between select-none font-sans">
        {/* 1. CHAP TOMON: Logotip */}
        <div
          onClick={() => {
            navigate("/");
            closeMenu();
          }}
          className="flex items-center space-x-2.5 cursor-pointer group z-50"
        >
          <div className="w-11 h-11 bg-[#E30A17] rounded-[10px] flex items-center justify-center text-white font-black text-lg shadow-md shadow-red-600/10 transition-transform group-hover:scale-105">
            <img className="size-8" src={logo} alt="logo" />
          </div>
          <h1 className="font-black text-xl tracking-tight text-gray-950">
            Quad<span className="text-[#E30A17]">Pizza</span>
          </h1>
        </div>

        {/* 2. MARKAZDA: Navigatsiya Linklari */}
        <nav className="hidden md:flex items-center space-x-8">
          {[
            { path: "/", label: "Bosh Sahifa" },
            { path: "/menu", label: "Menu" },
            { path: "/news", label: "Yangiliklar " },
            { path: "/about", label: "Biz Haqimizda" },
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-[15px] font-semibold transition-colors duration-200 ${
                  isActive
                    ? "text-[#E30A17]"
                    : "text-gray-600 hover:text-gray-950"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* 3. O'NG TOMON: Elementlar */}
        <div className="flex items-center space-x-2 sm:space-x-4 z-50">
          {/* 🌐 KOMPYUTER UCHUN TIL TANLASH (Dropdown) */}
          <div ref={langDropdownRef} className="relative hidden md:block">
            <div
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center space-x-1 bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 transition-all text-sm font-medium text-gray-700 select-none active:scale-95"
            >
              <Globe className="w-4 h-4 text-gray-500" />
              <span className="flex items-center space-x-1">
                <span className="font-bold">{currentLang}</span>
                <span
                  className={`text-[9px] text-gray-400 transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </span>
            </div>

            {/* Ochiladigan ro'yxat */}
            <div
              className={`absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl py-1 transition-all duration-200 origin-top-right ${
                isLangOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setCurrentLang(lang.code);
                    setIsLangOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                    currentLang === lang.code
                      ? "bg-red-50 text-[#E30A17]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                  }`}
                >
                  <span>{lang.name}</span>
                  {currentLang === lang.code && (
                    <span className="text-[10px]">●</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 🛒 Savat tugmasi (Rasmda ustida qizil bildirishnoma bor ekan, o'shani chiroyli qildim) */}
          <button
            onClick={() => {
              navigate("/basket");
              closeMenu();
            }}
            className="relative p-2 text-gray-700 hover:text-gray-950 transition-all mr-1"
          >
            <ShoppingCart className="w-5 h-5 stroke-2" />
          </button>

          {/* 🔐 Dinamik Tugmalar: Token bor/yo'qligiga qarab rasmga mos dizayn */}
          {user ? (
            <div className="hidden md:flex items-center space-x-3">
              {/* Dashboard Tugmasi - image_b0e1be.png dagi oq borderli tugma */}
              <button
                onClick={handleDashboard}
                className="flex items-center space-x-1.5 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-gray-500" />
                <span>Dashboard</span>
              </button>

              {/* Sign Out Tugmasi */}
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="flex items-center space-x-1.5 text-xs font-bold text-gray-600 hover:text-gray-950 transition-colors py-2 px-1"
              >
                <LogOut className="w-4 h-4 text-gray-400" />
                <span>Chiqsh</span>
              </button>
            </div>
          ) : (
            /* Agar login qilmagan bo'lsa oddiy Kirish tugmasi */
            <button
              onClick={() => {
                navigate("/login");
                closeMenu();
              }}
              className="hidden md:block bg-[#E30A17] text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-md shadow-red-600/10 hover:bg-red-700 active:scale-[0.98] transition-all"
            >
              Kirish
            </button>
          )}

          {/* 📱 Mobil Gamburger Tugmasi */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-gray-950 transition-all focus:outline-none"
          >
            {isOpen ? (
              <X className="w-6 h-6 stroke-[2.5]" />
            ) : (
              <Menu className="w-6 h-6 stroke-[2.5]" />
            )}
          </button>
        </div>
      </header>

      {/* 📱 Orqa fon qorayishi */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      />

      {/* 📱 MOBIL MENYU PANEL */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-40 shadow-2xl p-6 pt-24 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* 🌐 MOBIL UCHUN TIL TANLASH */}
          <div className="border border-gray-100 bg-gray-50/50 rounded-xl overflow-hidden transition-all">
            <button
              type="button"
              onClick={() => setIsMobLangOpen(!isMobLangOpen)}
              className="w-full flex items-center justify-between bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none"
            >
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <span>Tilni tanlang</span>
              </div>
              <span className="flex items-center space-x-1 text-gray-500 text-xs">
                <span className="text-[#E30A17] font-black">{currentLang}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${isMobLangOpen ? "rotate-180" : ""}`}
                />
              </span>
            </button>

            {/* Mobil tillar ro'yxati */}
            <div
              className={`transition-all duration-300 overflow-hidden ${isMobLangOpen ? "max-h-40 border-t border-gray-100 bg-white" : "max-h-0"}`}
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setCurrentLang(lang.code);
                    setIsMobLangOpen(false);
                  }}
                  className={`w-full text-left px-5 py-2.5 text-xs font-bold flex items-center justify-between border-b border-gray-50/50 last:border-none ${
                    currentLang === lang.code
                      ? "text-[#E30A17] bg-red-50/30"
                      : "text-gray-600"
                  }`}
                >
                  <span>{lang.name}</span>
                  {currentLang === lang.code && (
                    <span className="w-1.5 h-1.5 bg-[#E30A17] rounded-full"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Mobil Navigatsiya Linklari */}
          <nav className="flex flex-col space-y-3">
            {[
              { path: "/", label: "Bosh Sahifa" },
              { path: "/menu", label: "Menu" },
              { path: "/news", label: "Yangliklar" },
              { path: "/about", label: "Biz Haqimda" },
            ].map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `text-base font-bold py-2.5 px-2 rounded-xl transition-all ${
                    isActive
                      ? "text-[#E30A17] bg-red-50/50"
                      : "text-gray-600 hover:text-gray-950 hover:bg-gray-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Mobil Sign In / Dashboard bloklari */}
        <div className="space-y-3">
          {user ? (
            <>
              <button
                onClick={() => {
                  navigate("/manager");
                  closeMenu();
                }}
                className="w-full bg-white border border-gray-200 text-gray-800 font-bold text-center py-3 rounded-xl hover:bg-gray-50 transition-all text-sm flex items-center justify-center space-x-2"
              >
                <LayoutDashboard className="w-4 h-4 text-gray-500" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="w-full bg-gray-100 text-gray-700 font-bold text-center py-3 rounded-xl hover:bg-gray-200 transition-all text-sm flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4 text-gray-500" />
                <span>Chiqsh</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                closeMenu();
              }}
              className="w-full bg-[#E30A17] text-white font-bold text-center py-3.5 rounded-xl shadow-lg shadow-red-600/10 hover:bg-red-700 transition-all text-sm"
            >
              Kirish
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
