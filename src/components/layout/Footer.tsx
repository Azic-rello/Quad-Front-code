import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Clock } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#120808] text-zinc-400 pt-12 pb-6 md:pt-16 md:pb-8 px-4 sm:px-8 lg:px-16 border-t border-zinc-900/60 select-none font-sans">
      {/* 📱 To'liq moslashuvchan Grid tizimi */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 mb-12">
        {/* 1-Ustun: Brend, Matn va Ijtimoiy tarmoqlar */}
        <div className="space-y-5 text-center sm:text-left flex flex-col items-center sm:items-start">
          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-wide">
              Quad<span className="text-[#E30A17]">Uz</span>
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-sm leading-relaxed mx-auto sm:mx-0">
              Uyingizga yetkazib beriladigan eng mazali tezkor taomlar. Yangi
              masalliqlar, unutilmas ta'm va shahar bo'ylab chaqmoq tezligidagi
              yetkazib berish. Premium pizza ta'mini bugunoq his qiling!
            </p>
          </div>

          {/* Ijtimoiy tarmoqlar */}
          <div className="space-y-2.5 w-full flex flex-col items-center sm:items-start">
            <h4 className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">
              Ijtimoiy tarmoqlar
            </h4>
            <div className="flex items-center space-x-3">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/quad_pizzaa?igsh=MWZkZGV6bnJsM2R5ZA=="
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-zinc-900/80 border border-zinc-800/40 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-[#E1306C] hover:text-white hover:scale-105 transition-all duration-200"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-none stroke-current"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/Quad_pizzaa"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-zinc-900/80 border border-zinc-800/40 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-[#0088cc] hover:text-white hover:scale-105 transition-all duration-200"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-none stroke-current"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-zinc-900/80 border border-zinc-800/40 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-[#FF0000] hover:text-white hover:scale-105 transition-all duration-200"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-none stroke-current"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* 2-Ustun: Tezkor havolalar (Menu) */}
        <div className="space-y-4 text-center sm:text-left flex flex-col items-center sm:items-start">
          <h3 className="text-white font-bold text-base tracking-wide relative after:content-[''] after:block after:w-8 after:h-0.5 after:bg-[#E30A17] after:mt-1 after:mx-auto sm:after:mx-0">
            Tezkor havolalar
          </h3>
          <ul className="space-y-2.5 text-xs md:text-sm font-medium">
            {[
              { path: "/", label: "Bosh sahifa" },
              { path: "/menu", label: "Menyu" },
              { path: "/news", label: "Yangiliklar" },
              { path: "/about", label: "Biz haqimizda" },
            ].map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="hover:text-white hover:underline transition-all block py-0.5"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 3-Ustun: Bog'lanish ma'lumotlari (Contact) */}
        <div className="space-y-4 text-center sm:text-left flex flex-col items-center sm:items-start sm:col-span-2 lg:col-span-1">
          <h3 className="text-white font-bold text-base tracking-wide relative after:content-[''] after:block after:w-8 after:h-0.5 after:bg-[#E30A17] after:mt-1 after:mx-auto sm:after:mx-0">
            Aloqa
          </h3>
          <ul className="space-y-3.5 text-xs md:text-sm font-medium flex flex-col items-center sm:items-start">
            <li className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
              <span>Zarbdor Tumani Markazi</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
              <span className="text-white font-semibold tracking-wide">
                +998 94 320 00 21
              </span>
            </li>
            <li className="flex items-center space-x-2 text-[11px] text-zinc-500 pt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Ish vaqti: 09:00 - 00:00</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Pastki mualliflik huquqi qismi */}
      <div className="max-w-7xl mx-auto border-t border-zinc-900/60 pt-6 text-center text-[11px] text-zinc-600 font-medium tracking-wide">
        © 2026 Quad Pizza. Barcha huquqlar himoyalangan.
      </div>
    </footer>
  );
};

export default Footer;
