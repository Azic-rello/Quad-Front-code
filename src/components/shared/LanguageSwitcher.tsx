import { useState, useEffect, useRef } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "uz", name: "O'zbek", flag: "🇺🇿" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "en", name: "English", flag: "🇺🇸" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Joriy tanlangan tilni topish
  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === i18n.language) || LANGUAGES[0];

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
    setIsOpen(false); // Til tanlangach menyuni yopish
  };

  // Tashqariga bosganda menyuni yopish logikasi
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* 🔘 Asosiy Til Tugmasi */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="flex items-center space-x-2 bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-gray-100/70 px-3 py-2 rounded-xl text-sm font-semibold text-gray-800 transition-all duration-200 active:scale-95 shadow-sm"
      >
        <Globe className="w-4 h-4 text-gray-500" />
        <span className="text-base leading-none">{currentLanguage.flag}</span>
        <span className="hidden sm:inline text-xs">{currentLanguage.name}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* 🌐 Ochiladigan menyu (Dropdown) */}
      <div
        className={`absolute right-0 mt-2 w-40 origin-top-right rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl shadow-gray-200/50 z-50 transition-all duration-200 transform ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
      >
        <div className="space-y-0.5">
          {LANGUAGES.map((lang) => {
            const isSelected = i18n.language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isSelected
                    ? "bg-red-50 text-[#E30A17] font-bold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-base leading-none">{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 bg-[#E30A17] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
