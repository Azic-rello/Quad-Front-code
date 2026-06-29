import { useState, useEffect } from "react";

interface CategoryItem {
  id: string;
  name: string;
}

const MenuLayout = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Hammasi");

  useEffect(() => {
    // Manager qo'shgan kategoriyalarni localStoragedan real-time o'qib olish
    const savedCategories = localStorage.getItem("quad_categories");
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#080b16] py-12 px-4 text-white">
      <div className="max-w-7xl mx-auto text-center">
        {/* Sarlavha */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
            Bizning Menyu
          </h1>
          <p className="mt-4 text-slate-400 text-sm max-w-xl mx-auto">
            Eng sara va shirin taomlar faqat siz uchun. Buyurtma bering va
            rohatlaning!
          </p>
        </div>

        {/* 🟢 DINAMIK KATEGORIYALAR (Manager ichkaridan qo'shgan kategoriyalar shu yerda chiqadi) */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-3xl mx-auto">
          <button
            onClick={() => setSelectedCategory("Hammasi")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              selectedCategory === "Hammasi"
                ? "bg-[#00df9a] text-black border-transparent"
                : "bg-[#0d1224] text-slate-400 border-slate-800 hover:bg-slate-800"
            }`}
          >
            Hammasi
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === cat.name
                  ? "bg-[#00df9a] text-black border-transparent"
                  : "bg-[#0d1224] text-slate-400 border-slate-800 hover:bg-slate-800"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Kontent bo'sh holati */}
        <div className="text-center text-slate-500 py-12 border border-dashed border-slate-800 rounded-2xl max-w-4xl mx-auto text-sm">
          Hozircha menyuda taomlar mavjud emas.
        </div>
      </div>
    </div>
  );
};

export default MenuLayout;
