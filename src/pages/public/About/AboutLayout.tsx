import React, { useEffect } from "react";
import { Clock, ShieldCheck, CreditCard, Sparkles, Award, Users, Utensils } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

// Asosiy bitta katta rasm (O'zingiz xohlagan restoranning rasmi)
import aboutImg from "../../../assets/building.avif"; 

export default function AboutLayout() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      AOS.init({
        duration: 1000,
        once: true,
        easing: "ease-in-out",
      });
    }
  }, []);

  // Asosiy blok ostidagi 3 ta kichik statistika (Xuddi skrinshotingizdagidek)
  const stats = [
    { id: 1, value: "10+", label: "Years Experience" },
    { id: 2, value: "50k+", label: "Happy Customers" },
    { id: 3, value: "100+", label: "Unique Recipes" },
  ];

  // PASTKI QISM UCHUN MUTLAQO YANGI 4 TA FOYDALI BLOK (Gap qaytarilmagan)
  const features = [
    {
      id: 1,
      icon: <ShieldCheck className="w-6 h-6 text-orange-600" />,
      title: "100% Halol va Toza",
      desc: "Oshxonamizdagi har bir mahsulot va go'sht mahsulotlari to'liq halol sertifikatiga ega, gigiyena qoidalariga qat'iy amal qilinadi."
    },
    {
      id: 2,
      icon: <Clock className="w-6 h-6 text-red-600" />,
      title: "Issiq Holatda Yetkazish",
      desc: "Maxsus termo-sumkalarimiz yordamida taomlar pechdan qanday uzilgan bo'lsa, sizgacha aynan shunday issiqqina yetib boradi."
    },
    {
      id: 3,
      icon: <CreditCard className="w-6 h-6 text-yellow-600" />,
      title: "Oson To'lov Tizimi",
      desc: "Click, Payme, naqd pul yoki terminal orqali o'zingizga qulay usulda to'lovni amalga oshirishingiz mumkin."
    },
    {
      id: 4,
      icon: <Sparkles className="w-6 h-6 text-amber-600" />,
      title: "Doimiy Aksiyalar",
      desc: "Sodiq mijozlarimiz uchun har hafta maxsus promo-kodlar, keshbeklar va bepul yetkazib berish kunlarini tashkil qilamiz."
    }
  ];

  return (
    <div className="w-full bg-[#FAF9F6] font-sans scroll-smooth overflow-hidden min-h-screen">
      
      {/* 1. ASOSIY HERO SECTION (Skrinshotingizdagi struktura) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* CHAP TOMON: MATNLAR VA STATISTIKA */}
          <div className="w-full lg:col-span-5 text-center lg:text-left flex flex-col items-center lg:items-start" data-aos="fade-right">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-tight">
              About Burger Uz
            </h1>
            <p className="mt-4 text-gray-600 leading-relaxed text-sm sm:text-base max-w-xl">
              Bizning Quad ochilganidan beri hechqande Ortiqcha nizolarsz shikoyatlarsiz mukamal bo'lib o'sib kelmoqda hamma qulay shart-sharoitlar bizda
            </p>

            {/* 3 ta Kichik Oq Kartochkalar (Skrinshotdagi dizayn) */}
            <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-md">
              {stats.map((stat) => (
                <div key={stat.id} className="bg-white py-4 px-2 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center transition-all hover:shadow-md">
                  <span className="text-xl sm:text-2xl font-black text-red-500 tracking-tight">{stat.value}</span>
                  <span className="text-[10px] sm:text-xs text-gray-400 font-medium mt-1 text-center">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* O'NG TOMON: BITTA ASOSIY RASM */}
          <div className="w-full lg:col-span-7 flex justify-center lg:justify-end" data-aos="fade-left">
            <div className="relative w-full max-w-[550px] aspect-[4/3] rounded-[32px] overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.01]">
              <img 
                src={aboutImg} 
                alt="BurgerUz premium interior" 
                className="w-full h-full object-cover object-center select-none"
              />
            </div>
          </div>

        </div>
      </main>

      {/* 2. PASTKI YANGI BO'LIM: XIZMAT SIFATLARI (Takrorlanishsiz 4 ta blok) */}
      <section className="w-full bg-white border-t border-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          
          {/* Bo'lim Sarlavhasi */}
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16" data-aos="fade-up">
            <span className="text-orange-600 font-bold text-xs uppercase tracking-widest">Bizning ustunliklarimiz</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-950 mt-1">Nega aynan bizni tanlashadi?</h2>
          </div>

          {/* 4 talik Grid Tizimi (Rasm ishlatilmagan, faqat chiroyli ikonka va matn) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feat, idx) => (
              <div 
                key={feat.id} 
                className="bg-[#FAF9F6]/50 p-6 rounded-2xl border border-gray-100/80 flex flex-col items-center sm:items-start text-center sm:text-left transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-1"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className="p-3.5 bg-white rounded-xl shadow-sm border border-gray-100 shrink-0 mb-4">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-base md:text-lg mb-2">{feat.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}