import React from "react";
import type { Category } from "../types/productTypes";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  categories?: Category[] | null;
  isLoadingCategories?: boolean;
  hideSearch?: boolean; // Yangi prop
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  categories = [],
  isLoadingCategories = false,
  hideSearch = false,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 mb-6">
      <div
        className={`grid grid-cols-1 ${hideSearch ? "grid-cols-1" : "md:grid-cols-2"} gap-4`}
      >
        {/* Eski qidiruv joyi prop orqali yashiriladi */}
        {!hideSearch && (
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Qidirish
            </label>
            <input
              type="text"
              id="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Mahsulot nomi..."
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#e31221] outline-none transition-all"
            />
          </div>
        )}

        {/* Kategoriya Filtri */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-stone-700 mb-1"
          >
            Kategoriya bo'yicha filterlash
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={isLoadingCategories}
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#e31221] outline-none bg-white disabled:bg-stone-100 transition-all text-sm"
          >
            <option value="">Barcha kategoriyalar</option>
            {Array.isArray(categories) &&
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
};
