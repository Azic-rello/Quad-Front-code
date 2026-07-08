import React, { useState } from "react";
import {
  useProducts,
  useCategories,
} from "../../dashboard/manager/Components/products/hooks/useProducts";
import type {
  Product,
  Category,
} from "../../dashboard/manager/Components/products/types/productTypes";

interface CategoriesResponse {
  items: Category[];
}

const MenuLayout: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  // 1. Kategoriyalarni backenddan olish
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategories();

  // 2. Mahsulotlarni backenddan filtrlab olish
  const { data: productsData, isLoading: isProductsLoading } = useProducts({
    page,
    limit: 100,
    categoryId: selectedCategoryId || undefined,
  });

  const safeCategories =
    (categoriesData as unknown as CategoriesResponse)?.items ||
    (categoriesData as Category[]) ||
    [];

  return (
    <div className="min-h-screen bg-[#faf9f6] py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased text-stone-800">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ─── HEADING (IXCHAMROQ) ─── */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900">
            Menu
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm font-medium">
            Best fast food delivered to your door
          </p>
        </div>

        {/* ─── KATEGORIYALAR (IXCHAM VA CHUKUR) ─── */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => {
              setSelectedCategoryId("");
              setPage(1);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 transform active:scale-95 shadow-sm ${
              selectedCategoryId === ""
                ? "bg-[#e31221] text-white"
                : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            All
          </button>

          {isCategoriesLoading ? (
            <div className="h-7 w-24 bg-stone-200 animate-pulse rounded-full" />
          ) : (
            safeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategoryId(cat.id);
                  setPage(1);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 transform active:scale-95 shadow-sm ${
                  selectedCategoryId === cat.id
                    ? "bg-[#e31221] text-white"
                    : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
                }`}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>

        {/* ─── MAHSULOTLAR GRIDI (ASL LOVABLE O'LCHAMI: 4 TA USTUN) ─── */}
        {isProductsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-80 animate-pulse border border-stone-200"
              />
            ))}
          </div>
        ) : productsData?.items && productsData.items.length > 0 ? (
          /* Katta ekranlarda chiroyli 4 ta ustun bo'lib ixchamlashdi */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsData.items.map((product: Product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between"
              >
                {/* Rasm joyi (Asl nisbat pt-[65%]) */}
                <div className="relative pt-[65%] w-full bg-stone-50 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-xs font-medium">
                      Rasm yo'q
                    </div>
                  )}

                  {/* Ixchamgina Qizil Narx Badji */}
                  <span className="absolute top-2.5 right-2.5 bg-[#e31221] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                    {product.price.toLocaleString() + " so'm"}
                  </span>
                </div>

                {/* Kontent qismi (Ortiqcha majburiy balandliklar olib tashlandi) */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                  <div className="space-y-1">
                    <h3 className="font-bold text-stone-900 text-base tracking-tight line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-stone-400 text-xs line-clamp-2 min-h-8 leading-relaxed">
                      {product.description ||
                        "Ajoyib retsept asosida tayyorlangan issiq taom."}
                    </p>
                  </div>

                  {/* Standart Ixcham Tugma */}
                  <button
                    onClick={() =>
                      alert(`${product.name} savatchaga qo'shildi!`)
                    }
                    className="w-full bg-[#e31221] hover:bg-red-700 text-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.97]"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"
                      />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Bo'sh holat */
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300 max-w-xl mx-auto shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-stone-300 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-sm font-bold text-stone-800">
              Ushbu kategoriyada taomlar mavjud emas
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuLayout;
