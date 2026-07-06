import React, { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Edit2, Trash2, Plus } from "lucide-react";
import { categoryService, type Category } from "./categoryService";

export default function Categories() {
  // 📋 State-lar
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10; // Har bir sahifadagi elementlar soni

  // 🔄 Ma'lumotlarni yuklash funksiyasi
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll(page, limit, search);
      setCategories(data.items);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error("Kategoriyalarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce effekti yoki har safar page/search o'zgarganda yuklash
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCategories();
    }, 400); // Qidiruvda API-ga tinimsiz so'rov ketmasligi uchun 400ms kutadi

    return () => clearTimeout(delayDebounceFn);
  }, [page, search]);

  // 🔄 Statusni o'zgartirish (isActive)
  const handleStatusChange = async (id: string, currentStatus: boolean) => {
    try {
      await categoryService.changeStatus(id, !currentStatus);
      // Mahalliy stateni tezda yangilash
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, isActive: !currentStatus } : cat))
      );
    } catch (error) {
      console.error("Statusni o'zgartirishda xatolik:", error);
    }
  };

  // 🗑 Kategoriyani o'chirish
  const handleDelete = async (id: string) => {
    if (window.confirm("Rostdan ham ushbu kategoriyani o'chirmoqchimisiz?")) {
      try {
        await categoryService.delete(id);
        fetchCategories(); // Ro'yxatni qayta yangilash
      } catch (error) {
        console.error("O'chirishda xatolik:", error);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Top qism */}
      

      {/* Qidiruv paneli */}
      <div className="relative mb-6 max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Kategoriya nomini yozing..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Qidirganda birinchi sahifaga qaytaradi
          }}
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-all"
        />
      </div>

      {/* Jadval qismi */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            Yuklanmoqda...
          </div>
        ) : categories.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            Kategoriyalar topilmadi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm font-semibold uppercase border-b border-gray-200">
                  <th className="px-6 py-3">Rasm</th>
                  <th className="px-6 py-3">Nomi / Slug</th>
                  <th className="px-6 py-3">Mahsulotlar</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    {/* Rasm */}
                    <td className="px-6 py-4">
                      <img
                        src={category.imageUrl || "https://placehold.co/50x50?text=No+Image"}
                        alt={category.name}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                      />
                    </td>
                    {/* Nomi va Slug */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{category.name}</div>
                      <div className="text-xs text-gray-400">{category.slug}</div>
                    </td>
                    {/* Mahsulotlar soni */}
                    <td className="px-6 py-4 font-medium text-gray-600">
                      {category._count?.products ?? 0} ta mahsulot
                    </td>
                    {/* Status tugmasi */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleStatusChange(category.id, category.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                          category.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {category.isActive ? "Faol" : "O'chiq"}
                      </button>
                    </td>
                    {/* Amallar (Tahrirlash / O'chirish) */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 📑 Sahifalash (Pagination) paneli */}
        {!loading && categories.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm">
            <span className="text-gray-500">
              Sahifa <span className="font-semibold text-gray-800">{page}</span> / {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="p-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="p-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}