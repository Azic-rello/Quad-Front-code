import React, { useState } from "react";
import { categoryService } from "./categoryService"; // API xizmati yo'lini tekshirib oling
import { Plus, Link2, X, Sparkles } from "lucide-react";

interface CreateCategoryProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function CreateCategory({ onSuccess, onClose }: CreateCategoryProps) {
  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setSlug(autoSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !slug.trim()) {
      setError("Kategoriya nomi va slug bo'sh bo'lishi mumkin emas!");
      return;
    }

    setLoading(true);
    try {
      await categoryService.create({
        name: name.trim(),
        slug: slug.trim(),
        imageUrl: imageUrl.trim() || undefined,
      });

      setName("");
      setSlug("");
      setImageUrl("");
      
      onSuccess(); 
      onClose();   
    } catch (err: any) {
      setError(err.response?.data?.message || "Kategoriya qo'shishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-7 max-w-md w-full border border-stone-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all">
      
      {/* 🛑 Oynani yopish uchun burchakdagi X tugmasi */}
      <button 
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 p-1.5 hover:bg-stone-100 rounded-full transition-all"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Sarlavha qismi */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <span className="p-2 bg-red-50 rounded-xl inline-flex items-center justify-center">
            <Plus className="w-5 h-5 text-[#e31221]" />
          </span> 
          Yangi kategoriya
        </h2>
        <p className="text-xs text-stone-400 mt-1 pl-1">Tizim uchun yangi maxsus tur qo'shish</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Kategoriya Nomi Input */}
        <div>
          <label className="block text-[11px] font-extrabold text-stone-400 uppercase tracking-wider mb-1.5 pl-1">
            Kategoriya Nomi
          </label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => handleNameChange(e.target.value)} 
            placeholder="Masalan: Pitsalar" 
            className="w-full px-4 py-3 bg-stone-50/50 border border-stone-200/80 rounded-2xl text-sm font-semibold text-stone-800 placeholder-stone-400 focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-[#e31221] focus:outline-none transition-all duration-200 shadow-sm" 
            required 
          />
        </div>

        {/* Slug Input */}
        <div>
          <div className="flex justify-between items-center mb-1.5 pl-1">
            <label className="block text-[11px] font-extrabold text-stone-400 uppercase tracking-wider">
              Slug (URL kalit)
            </label>
            <span className="text-[10px] text-stone-400 font-medium flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded-md">
              <Sparkles className="w-3 h-3 text-amber-500" /> Avto-generatsiya
            </span>
          </div>
          <input 
            type="text" 
            value={slug} 
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))} 
            placeholder="masalan: pitsalar" 
            className="w-full px-4 py-3 bg-stone-50/50 border border-stone-200/80 rounded-2xl text-sm font-mono text-stone-600 placeholder-stone-300 focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-[#e31221] focus:outline-none transition-all duration-200 shadow-sm" 
            required 
          />
        </div>

        {/* Image URL Input */}
        <div>
          <label className="block text-[11px] font-extrabold text-stone-400 uppercase tracking-wider mb-1.5 pl-1">
            Rasm URL Linki <span className="text-stone-300 font-normal">(Ixtiyoriy)</span>
          </label>
          <div className="relative">
            <Link2 className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
            <input 
              type="url" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)} 
              placeholder="https://example.com/pizza.jpg" 
              className="w-full pl-11 pr-4 py-3 bg-stone-50/50 border border-stone-200/80 rounded-2xl text-sm font-medium text-stone-800 placeholder-stone-400 focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-[#e31221] focus:outline-none transition-all duration-200 shadow-sm" 
            />
          </div>
        </div>

        {/* ⚠️ Xatolik oynasi */}
        {error && (
          <div className="text-xs font-semibold text-red-600 bg-red-50/70 backdrop-blur-sm p-3.5 rounded-2xl border border-red-100 flex items-start gap-2 animate-shake">
            <span className="mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* ⚡️ Harakatlar paneli (Tugmalar) */}
        <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-3 text-stone-500 font-bold text-sm hover:bg-stone-100 rounded-2xl transition-all active:scale-95"
          >
            Bekor qilish
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-6 py-3 bg-[#e31221] text-white font-bold text-sm rounded-2xl hover:bg-[#c90f1b] hover:shadow-lg hover:shadow-red-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center min-w-27.5"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Yaratish"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}