import React, { useState, useEffect } from "react";

interface CategoryItem {
  id: string;
  name: string;
}

const CreatCategory = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [categoryName, setCategoryName] = useState("");

  // Tizim yuklanganda bor kategoriyalarni xotiradan olish
  useEffect(() => {
    const saved = localStorage.getItem("quad_categories");
    if (saved) {
      setCategories(JSON.parse(saved));
    }
  }, []);

  // Kategoriya qo'shish funksiyasi
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return alert("Kategoriya nomini yozing!");

    const newCat: CategoryItem = {
      id: Date.now().toString(),
      name: categoryName.trim(),
    };

    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem("quad_categories", JSON.stringify(updated));
    setCategoryName("");
  };

  // Kategoriya o'chirish funksiyasi
  const handleDelete = (id: string) => {
    if (window.confirm("Bu kategoriyani o'chirishni xohlaysizmi?")) {
      const filtered = categories.filter((c) => c.id !== id);
      setCategories(filtered);
      localStorage.setItem("quad_categories", JSON.stringify(filtered));
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Kategoriya qo'shish formasi */}
      <div className="bg-[#0f162a] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4">
          ➕ Yangi Kategoriya Qo'shish
        </h3>
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Kategoriya nomi (Masalan: Burgerlar, Ichimliklar)"
            className="flex-1 bg-[#080b16] border border-slate-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00df9a] transition-all"
          />
          <button
            type="submit"
            className="bg-[#00df9a] hover:bg-[#00c789] text-black px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap"
          >
            Qo'shish
          </button>
        </form>
      </div>

      {/* Ro'yxat */}
      <div className="bg-[#0f162a] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <h3 className="text-sm font-semibold text-slate-400 mb-4">
          Mavjud Kategoriyalar ro'yxati:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((c) => (
            <div
              key={c.id}
              className="bg-[#080b16] border border-slate-800 p-4 rounded-xl flex justify-between items-center"
            >
              <span className="text-white text-sm font-medium">{c.name}</span>
              <button
                onClick={() => handleDelete(c.id)}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-500/20 transition-all"
              >
                O'chirish
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatCategory;
