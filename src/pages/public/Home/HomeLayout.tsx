import { useEffect } from "react";
import { ArrowRight, Flame, Truck, Clock, Utensils } from "lucide-react";
// react-router-dom dan Link komponentini olib kelamiz
import { Link } from "react-router-dom";
// Animatsiya uchun AOS kutubxonasi
import AOS from "aos";
import "aos/dist/aos.css";

// Loyihangizdagi barcha rasmlarni import qilish
import burgerImg from "../../../assets/photo-1568901346375-23c9450c58cd.avif";
import classicBurgerImg from "../../../assets/Clasic Burger.avif";
import doubleCheeseImg from "../../../assets/Double Cheese.avif";
import margheritaImg from "../../../assets/Margherita.avif";
import pepperoniImg from "../../../assets/Peperoni.avif";

export default function HomeLayout() {
  // Sahifa yuklanganda animatsiyalarni xavfsiz ishga tushirish
  useEffect(() => {
    if (typeof window !== "undefined") {
      AOS.init({
        duration: 1000,
        once: true,
        easing: "ease-in-out",
      });
    }
  }, []);

  // Menyudagi har bir taomga o'z rasmini bog'lab chiqdik
  const menuItems = [
    {
      id: 1,
      name: "Klassik Burger",
      price: "35,000 so'm",
      image: classicBurgerImg,
      desc: "Sershira go'sht, yangi sabzavotlar va maxsus sous.",
    },
    {
      id: 2,
      name: "Double Cheese",
      price: "45,000 so'm",
      image: doubleCheeseImg,
      desc: "Ikki hissa pishloq va ikki karra mazali go'sht.",
    },
    {
      id: 3,
      name: "Margarita Pizza",
      price: "65,000 so'm",
      image: margheritaImg,
      desc: "Italyancha xamir, pomidor va motsarella pishlog'i.",
    },
    {
      id: 4,
      name: "Pepperoni Pizza",
      price: "75,000 so'm",
      image: pepperoniImg,
      desc: "Achchiqqina pepperoni va cho'ziluvchan pishloq.",
    },
  ];

  return (
    <div className="w-full bg-gray-50 font-sans scroll-smooth">
      {/* 1. HERO SECTION (GRADIENT YUKORI QISM) */}
      <div className="w-full bg-linear-to-r from-orange-500 via-orange-600 to-yellow-500 shadow-xl relative overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none z-0" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20 lg:py-28 z-10 relative">
          <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
            {/* TEXT BLOKI */}
            <div
              className="w-full text-center md:text-left flex flex-col items-center md:items-start order-2 md:order-1"
              data-aos="fade-right"
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-white">
                <Flame className="w-4 h-4 text-yellow-300 shrink-0" />
                <span>Zarbdorda 1-raqamli fastfud</span>
              </div>
              <h1 className="mt-4 md:mt-6 text-white font-black leading-[1.05] tracking-tight text-[clamp(2rem,5vw,4.5rem)]">
                Mazzali, <br /> Issiq Va Tez
              </h1>
              <p className="mt-4 md:mt-6 text-orange-50 leading-relaxed max-w-xl text-sm sm:text-base lg:text-lg">
                Buyurtma qilingan Taomingniz Juda Tez Va ehtiyotkorlik Bilan
                yetkaziladi
              </p>

              {/* O'TISH TUGMALARI */}
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center md:justify-start">
                <Link
                  to="/menu"
                  className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all text-sm sm:text-base shrink-0 active:scale-95"
                >
                  <span>Menu Ko'rsh </span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/about"
                  className="w-full sm:w-auto border border-white/60 hover:border-white hover:bg-white/10 text-white font-semibold px-6 py-3.5 rounded-xl flex items-center justify-center transition-all text-sm sm:text-base shrink-0 active:scale-95"
                >
                  Biz Haqimizda
                </Link>
              </div>
            </div>

            {/* HERO RASM BLOKI */}
            <div
              className="w-full flex justify-center md:justify-end order-1 md:order-2"
              data-aos="fade-left"
            >
              <div className="relative w-full max-w-65 sm:max-w-85 md:max-w-95 lg:max-w-110 aspect-square rounded-3xl overflow-hidden shadow-2xl md:rotate-3 transition-all duration-300 hover:rotate-0 hover:scale-105">
                <img
                  src={burgerImg}
                  alt="Special Burger"
                  className="w-full h-full object-cover object-center select-none"
                />
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* 2. FEATURES SECTION (XIZMATLAR BO'LIMI) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-12 md:pt-16 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div
            className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm flex items-center gap-4 border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-md"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                yetkazib berish
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">10 000 soʻm</p>
            </div>
          </div>

          <div
            className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm flex items-center gap-4 border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-md"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <div className="p-3 bg-red-100 text-red-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                30 daqiqada yetkazib berish
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                O‘rtacha yetkazib berish vaqti
              </p>
            </div>
          </div>

          <div
            className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm flex items-center gap-4 border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-md"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                Issiq va yangi
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Butun donli bug‘doy unidan tayyorlangan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MENU SECTION (TAOMLAR RO'YXATI) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24">
        <div
          className="flex justify-between items-end mb-8 md:mb-12"
          data-aos="fade-up"
        >
          <div>
            <span className="text-orange-600 font-bold text-xs sm:text-sm uppercase tracking-wider">
              Bizning maxsus
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mt-1">
              Menyular
            </h2>
          </div>
          {/* O'ng tarafdagi View More tugmasi ham Link qilib o'zgartirildi */}
          <Link
            to="/menu"
            className="text-orange-600 font-bold text-sm hover:text-orange-700 flex items-center gap-1 transition-all"
          >
            <span>Ko`proq ko`rish</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Ustunlar barcha telefon va planshet ekranlariga moslashtirilgan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-center select-none transition-transform duration-500 hover:scale-110"
                />
                <span className="absolute top-3 right-3 bg-red-500 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-md">
                  {item.price}
                </span>
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 text-base md:text-lg mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md active:scale-95">
                  Savatga qo‘shish
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
