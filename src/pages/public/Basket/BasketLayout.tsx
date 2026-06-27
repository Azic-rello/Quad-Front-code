import { useEffect, useState } from "react";
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, CreditCard } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function BasketLayout() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      AOS.init({
        duration: 1000,
        once: true,
        easing: "ease-in-out",
      });
    }
  }, []);

  // Sening talabing bo'yicha: Savat boshida MUTLAQO BO'SH (Hech qanday demo mahsulotsiz)
  const [cartItems, setCartItems] = useState([]);

  // Buyurtma formasi holati
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    telegram: "",
  });

  // Miqdorni o'zgartirish (Kelajakda ma'lumot qo'shilsa ishlaydi)
  const handleQuantityChange = (id, type) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQty = type === "increment" ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: newQty < 1 ? 1 : newQty };
        }
        return item;
      })
    );
  };

  // Mahsulotni o'chirish
  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="w-full bg-[#FAF9F6] font-sans scroll-smooth min-h-screen pb-20 overflow-hidden">
      
      {/* SARLAVHA BO'LIMI */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-6" data-aos="fade-down">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-950 tracking-tight">
          Savat
        </h1>
        <p className="mt-2 text-sm text-gray-500 font-medium">
          Buyurtmangizni tekshiring va rasmiylashtiring
        </p>
      </header>

      {/* ASOSIY BLOCK */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        {cartItems.length === 0 ? (
          
          /* === MANA SHU SEYTGA KIRGANDA TURADIGAN DAXSHAT EMPTY STATE UI === */
          <div 
            className="w-full bg-white rounded-[32px] p-12 md:p-20 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center max-w-3xl mx-auto min-h-[400px]" 
            data-aos="fade-up"
          >
            {/* Minimalistik va chiroyli oq fondagi yukxalta ikonkasi */}
            <div className="p-5 bg-orange-50 text-orange-600 rounded-2xl mb-6 shadow-sm border border-orange-100/50 animate-bounce duration-1000">
              <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
            </div>
            
            <h3 className="font-black text-gray-950 text-xl sm:text-2xl tracking-tight">
              Savatingiz hozircha bo'sh
            </h3>
            
            <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-sm leading-relaxed font-medium">
              Xarid qilishni boshlash uchun menyu bo'limiga o'ting va o'zingizga yoqqan eng mazali taomlarni qo'shing.
            </p>

            {/* Ortga qaytish premium tugmasi */}
            <button className="mt-8 inline-flex items-center gap-2 bg-gray-950 hover:bg-gray-900 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition-all active:scale-95 group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Menyuga qaytish</span>
            </button>
          </div>

        ) : (
          
          /* === AGAR MABODO SAVATGA MAHSULOT QO'SHILSA CHIQADIGAN RESPONSIVE GRID === */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* MAHSULOTLAR RO'YXATI */}
            <div className="w-full lg:col-span-7 flex flex-col gap-4">
              {cartItems.map((item, idx) => (
                <div 
                  key={item.id} 
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md"
                  data-aos="fade-right"
                  data-aos-delay={idx * 50}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover object-center select-none" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-950 text-base sm:text-lg leading-tight">{item.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-400 font-semibold mt-1">{(item.price).toLocaleString("uz-UZ")} so'm</p>
                      
                      <div className="flex items-center gap-1 bg-gray-50 border border-gray-200/60 rounded-xl p-1 mt-3 w-fit">
                        <button onClick={() => handleQuantityChange(item.id, "decrement")} className="p-1.5 hover:bg-white text-gray-600 rounded-lg transition-colors active:scale-90">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs sm:text-sm font-black text-gray-900 select-none min-w-[20px] text-center">{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.id, "increment")} className="p-1.5 hover:bg-white text-gray-600 rounded-lg transition-colors active:scale-90">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-50">
                    <span className="font-black text-red-500 text-base sm:text-lg">
                      {(item.price * item.quantity).toLocaleString("uz-UZ")} so'm
                    </span>
                    <button onClick={() => handleRemoveItem(item.id)} className="mt-0 sm:mt-4 text-xs font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors group px-2 py-1 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 transition-colors" />
                      <span>O'chirish</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* CHEKOUT / RASMIYLASHTIRISH FORMASI */}
            <div className="w-full lg:col-span-5" data-aos="fade-left">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-black text-gray-950 tracking-tight border-b border-gray-50 pb-4">
                  Rasmiylashtirish
                </h2>

                <div className="flex items-center justify-between py-5">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Umumiy summa</span>
                  <span className="text-xl sm:text-2xl font-black text-red-500 tracking-tight">
                    {totalAmount.toLocaleString("uz-UZ")} so'm
                  </span>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">Ism</label>
                      <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} placeholder="Ismingiz" className="w-full bg-gray-50/50 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">Familiya</label>
                      <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} placeholder="Familiyangiz" className="w-full bg-gray-50/50 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 text-sm transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">Telefon raqam</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+998 ..." className="w-full bg-gray-50/50 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 text-sm transition-all font-medium" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">Telegram (ixtiyoriy)</label>
                    <input type="text" value={formData.telegram} onChange={(e) => setFormData({...formData, telegram: e.target.value})} placeholder="@username" className="w-full bg-gray-50/50 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 text-sm transition-all" />
                  </div>

                  <button className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl text-sm transition-all shadow-md active:scale-[0.98] mt-2 flex items-center justify-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Buyurtma berish</span>
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}
      </main>

    </div>
  );
}