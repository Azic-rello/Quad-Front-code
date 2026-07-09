import React, { useState } from "react";
import {
  useProducts,
  useCategories,
} from "../../dashboard/manager/Components/products/hooks/useProducts";
import type {
  Product,
  Category,
  ProductVariant,
} from "../../dashboard/manager/Components/products/types/productTypes";
import { ShoppingBag, ImageIcon, Check } from "lucide-react";
import { toast } from "sonner";

interface CategoriesResponse {
  items: Category[];
}

export const MenuLayout: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [page] = useState<number>(1);

  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategories();

  const { data: productsData, isLoading: isProductsLoading } = useProducts({
    page,
    limit: 100,
    categoryId: selectedCategoryId || undefined,
    isAvailable: true,
  });

  const safeCategories =
    (categoriesData as unknown as CategoriesResponse)?.items ||
    (categoriesData as Category[]) ||
    [];

  const handleAddToCart = (product: Product) => {
    const availableVariants =
      product.variants?.filter((v) => v.isAvailable) || [];

    let finalPrice = product.price ?? 0;
    let variantName = "";
    let variantId = null;

    if (availableVariants.length > 0) {
      const currentVariantId = selectedVariants[product.id];
      const selectedVariant = currentVariantId
        ? availableVariants.find((v) => v.id === currentVariantId)
        : availableVariants.find((v) => v.isDefault) || availableVariants[0];

      if (selectedVariant) {
        finalPrice = selectedVariant.price;
        variantName = ` (${selectedVariant.name})`;
        variantId = selectedVariant.id;
      }
    }

    const existingCartRaw = localStorage.getItem("cart");
    const existingCart = existingCartRaw ? JSON.parse(existingCartRaw) : [];

    const cartItemId = variantId ? `${product.id}-${variantId}` : product.id;

    const existingItemIndex = existingCart.findIndex(
      (item: any) => item.id === cartItemId,
    );

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push({
        id: cartItemId,
        productId: product.id,
        variantId: variantId,
        name: `${product.name}${variantName}`,
        price: Number(finalPrice),
        image: product.imageUrl || "",
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    toast.success(`${product.name}${variantName} savatchaga qo'shildi!`);

    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased text-stone-800 selection:bg-red-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* ─── HEADING ─── */}
        <div className="space-y-2 text-left animate-in fade-in duration-500">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-stone-950">
            Bizning Menyu
          </h1>
          <p className="text-stone-400 text-sm sm:text-base font-semibold">
            Eng sara va mazali taomlar faqat siz uchun
          </p>
        </div>

        {/* ─── KATEGORIYALAR ─── */}
        <div className="flex flex-wrap items-center gap-2.5 pb-2 border-b border-stone-200/40 select-none animate-in fade-in duration-500 delay-75">
          <button
            onClick={() => setSelectedCategoryId("")}
            className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wide transition-all duration-200 transform active:scale-95 shadow-2xs cursor-pointer ${
              selectedCategoryId === ""
                ? "bg-[#e31221] text-white shadow-md shadow-red-900/10"
                : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200/70"
            }`}
          >
            Barchasi
          </button>

          {isCategoriesLoading ? (
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-9 w-24 bg-stone-200/80 animate-pulse rounded-full"
                />
              ))}
            </div>
          ) : (
            safeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wide transition-all duration-200 transform active:scale-95 shadow-2xs cursor-pointer ${
                  selectedCategoryId === cat.id
                    ? "bg-[#e31221] text-white shadow-md shadow-red-900/10"
                    : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200/70"
                }`}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>

        {/* ─── MAHSULOTLAR GRIDI ─── */}
        {isProductsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-[28px] h-96 animate-pulse border border-stone-100 p-4 space-y-4 shadow-2xs"
              >
                <div className="w-full h-48 bg-stone-100 rounded-2xl" />
                <div className="h-5 bg-stone-100 rounded-lg w-2/3" />
                <div className="h-4 bg-stone-100 rounded-lg w-full" />
                <div className="h-10 bg-stone-100 rounded-xl w-full pt-2" />
              </div>
            ))}
          </div>
        ) : productsData?.items && productsData.items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {productsData.items.map((product: Product) => {
              const availableVariants =
                product.variants?.filter((v) => v.isAvailable) || [];
              const chosenVariantId = selectedVariants[product.id];

              const activeVariant = chosenVariantId
                ? availableVariants.find((v) => v.id === chosenVariantId)
                : availableVariants.find((v) => v.isDefault) ||
                  availableVariants[0];

              const displayPrice = activeVariant
                ? activeVariant.price
                : (product.price ?? 0);

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-[28px] overflow-hidden border border-stone-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Rasm qismi */}
                  <div className="relative pt-[70%] w-full bg-stone-50 overflow-hidden select-none">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-300 gap-1">
                        <ImageIcon className="w-8 h-8 stroke-[1.5]" />
                        <span className="text-[10px] font-bold">Rasm yo'q</span>
                      </div>
                    )}

                    {/* Dinamik Narx Badge */}
                    <span className="absolute bottom-3 right-3 bg-stone-950 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-sm tracking-tight z-10">
                      {Number(displayPrice).toLocaleString("uz-UZ")} so'm
                    </span>
                  </div>

                  {/* Kontent qismi */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-stone-950 text-base sm:text-lg tracking-tight line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-stone-400 text-xs font-medium line-clamp-2 min-h-[32px] leading-relaxed">
                        {product.description ||
                          "Ajoyib retsept asosida yangi va issiq tayyorlangan maxsus taom."}
                      </p>
                    </div>

                    {/* ✅ YANGI VARIANT DIZAYNI - Minimal va Premium */}
                    {availableVariants.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                          O'lchamini tanlang
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {availableVariants.map((variant: ProductVariant) => {
                            const isSelected = activeVariant?.id === variant.id;
                            return (
                              <button
                                key={variant.id}
                                onClick={() =>
                                  setSelectedVariants((prev) => ({
                                    ...prev,
                                    [product.id]: variant.id,
                                  }))
                                }
                                className={`
                                  relative px-3 py-1.5 rounded-lg text-[11px] font-bold 
                                  border transition-all duration-200 cursor-pointer
                                  flex items-center gap-1
                                  ${
                                    isSelected
                                      ? "bg-[#e31221] text-white border-[#e31221] shadow-sm shadow-red-900/10"
                                      : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                                  }
                                `}
                              >
                                {isSelected && (
                                  <Check className="w-3 h-3 stroke-[3]" />
                                )}
                                <span>{variant.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Savatga qo'shish tugmasi */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-[#e31221] hover:bg-red-700 text-white rounded-xl py-3 text-xs font-black flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.97] cursor-pointer shadow-xs shadow-red-900/10"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Savatga qo'shish</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-stone-200 max-w-xl mx-auto shadow-2xs animate-in fade-in duration-300">
            <div className="text-3xl mb-3">🍽️</div>
            <h3 className="text-sm font-bold text-stone-800">
              Ushbu kategoriyada hozircha taomlar mavjud emas.
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Birozdan so'ng tekshirib ko'ring yoki boshqa bo'limga o'ting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuLayout;
