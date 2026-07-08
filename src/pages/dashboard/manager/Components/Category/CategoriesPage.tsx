import { useState, useRef } from "react";
import CategoriesList from "./CategoryListPage"; // Ro'yxat komponentingiz
import CreateCategory from "./creatcategory";

export default function CategoriesManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const listRef = useRef<{ fetchCategories: () => void }>(null);

  const handleSuccess = () => {
    if (listRef.current) {
      listRef.current.fetchCategories(); // Ro'yxatni qayta chizish funksiyasi
    }
  };

  return (
    <div className="relative min-h-screen bg-stone-50 p-6">
      {/* Sahifa tepasi */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Kategoriyalar Boshqaruvi</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-[#e31221] text-white font-semibold rounded-2xl hover:bg-[#c90f1b] transition"
        >
          + Yangi Kategoriya
        </button>
      </div>

      {/* 📋 Ro'yxat shu yerda ko'rinadi */}
      <CategoriesList ref={listRef} />

      {/* 🛍 Agar modal ochiq bo'lsa, orqa fonni xiralashtirib modalni ko'rsatish */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <CreateCategory
            onSuccess={handleSuccess} 
            onClose={() => setIsModalOpen(false)} 
          />
        </div>
      )}
    </div>
  );
}