import { useState, useEffect } from "react";

interface FoodItem {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  category: string;
}

const MenuLayout = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);

  // Manager qo'shgan taomlarni localStorage'dan o'qib olish
  useEffect(() => {
    const savedFoods = localStorage.getItem("quad_menu_foods");
    if (savedFoods) {
      setFoods(JSON.parse(savedFoods));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#080b16] py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Sarlavha qismi */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
            Bizning Menyu
          </h1>
          <p className="mt-4 text-slate-400 text-base max-w-xl mx-auto">
            Eng sara va shirin taomlar faqat siz uchun. Buyurtma bering va
            rohatlaning!
          </p>
        </div>

        {/* Taomlar ro'yxati */}
        {foods.length === 0 ? (
          <div className="text-center text-slate-500 py-12 border border-dashed border-slate-800 rounded-2xl">
            Hozircha menyuda taomlar mavjud emas.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {foods.map((item) => (
              <div
                key={item.id}
                className="bg-[#0d1224] rounded-2xl border border-slate-800/60 overflow-hidden shadow-lg flex flex-col justify-between group hover:border-[#00df9a]/50 transition-all duration-350"
              >
                {/* Rasm */}
                <div className="h-48 w-full bg-[#151c33] overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/400x300/151c33/fff?text=No+Image";
                    }}
                  />
                  <span className="absolute top-3 left-3 bg-[#080b16]/80 text-[#00df9a] backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded border border-slate-800">
                    {item.category}
                  </span>
                </div>

                {/* Kontent */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-white text-base truncate group-hover:text-[#00df9a] transition-all">
                      {item.name}
                    </h3>
                    <p className="text-[#00df9a] font-bold mt-1 text-sm">
                      {Number(item.price).toLocaleString("uz-UZ")} UZS
                    </p>
                  </div>

                  {/* Buyurtma berish tugmasi */}
                  <button className="w-full bg-[#151c33] hover:bg-[#00df9a] hover:text-black text-white py-2.5 rounded-xl text-xs font-bold border border-slate-800 hover:border-transparent transition-all duration-300">
                    Savatga qo'shish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuLayout;
