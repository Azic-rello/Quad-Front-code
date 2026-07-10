import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingCart, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
// Auth store olib kiriladi, tokenni tekshirish va logout qilish uchun
import { useAuthStore } from "../../modules/auth/authStore";
import logo from "../../assets/logo.png";
import LanguageSwitcher from "../shared/LanguageSwitcher";

// 🌐 Alohida yozilgan komponentni import qilamiz

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Mobil menyu holati

  // Global Auth holatlarini olamiz
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const closeMenu = () => {
    setIsOpen(false);
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

        {/* 2. MARKAZDA: Navigatsiya Linklari (Dinamil tarjima bilan) */}
        <nav className="hidden md:flex items-center space-x-8">
          {[
            { path: "/", label: t("navbar.home") },
            { path: "/menu", label: t("navbar.menu") },
            { path: "/about", label: t("navbar.about") },
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
        <div className="flex items-center space-x-2 sm:space-x-4 z-50 relative">
          {/* 🌐 KOMPYUTER UCHUN TIL TANLASH KOMPONENTI */}
          <div className="hidden md:block relative">
            <LanguageSwitcher />
          </div>

          {/* 🛒 Savat tugmasi */}
          <button
            onClick={() => {
              navigate("/basket");
              closeMenu();
            }}
            className="relative p-2 text-gray-700 hover:text-gray-950 transition-all mr-1"
            title={t("navbar.cart")}
          >
            <ShoppingCart className="w-5 h-5 stroke-2" />
          </button>

          {/* 🔐 Dinamik Tugmalar */}
          {user ? (
            <div className="hidden md:flex items-center space-x-3">
              {/* Dashboard Tugmasi */}
              <button
                onClick={handleDashboard}
                className="flex items-center space-x-1.5 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-gray-500" />
                <span>{t("navbar.dashboard")}</span>
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
                <span>{t("navbar.logout")}</span>
              </button>
            </div>
          ) : (
            /* Login tugmasi */
            <button
              onClick={() => {
                navigate("/login");
                closeMenu();
              }}
              className="hidden md:block bg-[#E30A17] text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-md shadow-red-600/10 hover:bg-red-700 active:scale-[0.98] transition-all"
            >
              {t("navbar.login")}
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
          {/* 🌐 MOBILDA TIL TANLASH KOMPONENTI */}
          <div className="relative border-b border-gray-100 pb-2">
            <span className="text-xs font-bold text-gray-400 block mb-2 px-1">
              {t("navbar.language")}
            </span>
            <LanguageSwitcher />
          </div>

          {/* Mobil Navigatsiya Linklari */}
          <nav className="flex flex-col space-y-3">
            {[
              { path: "/", label: t("navbar.home") },
              { path: "/menu", label: t("navbar.menu") },
              { path: "/news", label: t("navbar.news") },
              { path: "/about", label: t("navbar.about") },
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
                onClick={handleDashboard}
                className="w-full bg-white border border-gray-200 text-gray-800 font-bold text-center py-3 rounded-xl hover:bg-gray-50 transition-all text-sm flex items-center justify-center space-x-2"
              >
                <LayoutDashboard className="w-4 h-4 text-gray-500" />
                <span>{t("navbar.dashboard")}</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="w-full bg-gray-100 text-gray-700 font-bold text-center py-3 rounded-xl hover:bg-gray-200 transition-all text-sm flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4 text-gray-500" />
                <span>{t("navbar.logout")}</span>
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
              {t("navbar.login")}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
