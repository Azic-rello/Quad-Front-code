import React, { useState, useMemo } from "react";
import type { Product } from "../types/productTypes";
import { useAuthStore } from "@/modules/auth/authStore";
import {
  Pencil,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Trash2,
  ImageIcon,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isAvailable: boolean) => void;
  onManageVariants: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onToggleStatus,
  onManageVariants,
}) => {
  const { user } = useAuthStore();
  const canManage = user?.role === "ADMIN" || user?.role === "MANAGER";

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );

  const availableVariants = useMemo(() => {
    return product.variants?.filter((v) => v.isAvailable) || [];
  }, [product.variants]);

  const selectedVariant = useMemo(() => {
    if (selectedVariantId) {
      return availableVariants.find((v) => v.id === selectedVariantId);
    }
    return availableVariants.find((v) => v.isDefault) || availableVariants[0];
  }, [selectedVariantId, availableVariants]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("uz-UZ");
  };

  const getVariantColor = (variantName: string) => {
    const name = variantName.toLowerCase();
    if (
      name.includes("kichik") ||
      name.includes("small") ||
      name.includes("s")
    ) {
      return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-300";
    }
    if (
      name.includes("o'rta") ||
      name.includes("orta") ||
      name.includes("medium") ||
      name.includes("m")
    ) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-300";
    }
    if (
      name.includes("katta") ||
      name.includes("large") ||
      name.includes("l")
    ) {
      return "bg-purple-50 text-purple-700 border-purple-200 ring-purple-300";
    }
    return "bg-amber-50 text-amber-800 border-amber-200 ring-amber-300";
  };

  const categoryName = product.category?.name || "Kategoriya yo'q";
  const variantsCount = product.variants?.length || 0;

  return (
    <div className="bg-white rounded-[28px] border border-stone-100 shadow-xs overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full animate-in fade-in duration-300">
      {/* ─── RASM QISMI ─── */}
      <div className="relative h-56 bg-stone-50 overflow-hidden select-none">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              const placeholder = e.currentTarget
                .nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = "flex";
            }}
          />
        ) : null}

        {/* Rasm bo'lmaganda chiqadigan placeholder */}
        {!product.imageUrl && (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 gap-2">
            <ImageIcon className="w-12 h-12 stroke-[1.5]" />
            <span className="text-xs font-semibold text-stone-400">
              Rasm yuklanmagan
            </span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide shadow-2xs backdrop-blur-md ${
              product.isAvailable
                ? "bg-emerald-500 text-white"
                : "bg-stone-800 text-white"
            }`}
          >
            {product.isAvailable ? "Faol" : "Nofaol"}
          </span>
        </div>

        {/* Variantlar Soni Badge */}
        {variantsCount > 0 && (
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide bg-white/90 text-stone-900 border border-stone-200/40 shadow-2xs backdrop-blur-sm">
              {variantsCount} variant
            </span>
          </div>
        )}
      </div>

      {/* ─── KARTA MATNI VA MA'LUMOTLARI ─── */}
      <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
        <div>
          <span className="text-[11px] font-black tracking-wider text-red-600 uppercase bg-red-50 px-2.5 py-1 rounded-lg inline-block mb-2">
            {categoryName}
          </span>
          <h3
            className="text-xl font-bold text-stone-950 truncate line-clamp-1 mb-1"
            title={product.name}
          >
            {product.name}
          </h3>

          {product.description && (
            <p className="text-sm text-stone-500 font-medium line-clamp-2 min-h-[40px] leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* ─── VARIANTLAR PANELi ─── */}
        <div>
          {availableVariants.length > 0 ? (
            <div className="space-y-3">
              {/* Variant tugmalari */}
              <div className="flex flex-wrap gap-2">
                {availableVariants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer active:scale-95 ${
                      selectedVariant?.id === variant.id
                        ? getVariantColor(variant.name) +
                          " border-2 ring-2 ring-offset-1 font-extrabold"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {variant.name}
                      {variant.isDefault && (
                        <span className="text-[9px] opacity-60 font-normal">
                          (Asosiy)
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>

              {/* Tanlangan Variant Narxi */}
              {selectedVariant && (
                <div className="flex items-center justify-between p-4 bg-stone-50 border border-stone-100 rounded-2xl">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Narxi
                    </p>
                    {selectedVariant.sku && (
                      <p className="text-[10px] text-stone-400 font-mono">
                        SKU: {selectedVariant.sku}
                      </p>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-stone-950 tracking-tight">
                      {formatPrice(Number(selectedVariant.price))}
                    </span>
                    <span className="text-xs font-bold text-stone-500">
                      so'm
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-stone-50 border border-dashed border-stone-200 rounded-2xl text-center">
              <p className="text-xs font-semibold text-stone-400">
                Hozircha faol variantlar yo'q
              </p>
            </div>
          )}
        </div>

        {/* ─── SITESIMIZGA MOS ASSORTIMENT BOSHQARUV TUGMALARI ─── */}
        {canManage && (
          <div className="pt-4 border-t border-stone-100 space-y-2.5">
            {/* Variantlarni Boshqarish */}
            <button
              onClick={() => onManageVariants(product)}
              className="w-full px-4 py-3 bg-[#ffdd00] hover:bg-[#ebd000] text-stone-950 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-2xs transition-all duration-200 cursor-pointer active:scale-[0.99]"
            >
              <SlidersHorizontal className="w-4 h-4 text-stone-950 stroke-[2.5]" />
              Variantlarni boshqarish ({variantsCount})
            </button>

            {/* Tahrirlash, Muzlatish va O'chirish qatori */}
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 px-3 py-2.5 bg-stone-100 hover:bg-stone-200/80 text-stone-800 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <Pencil className="w-3.5 h-3.5" />
                Tahrirlash
              </button>

              <button
                onClick={() => onToggleStatus(product.id, !product.isAvailable)}
                className={`flex-1 px-3 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                  product.isAvailable
                    ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                {product.isAvailable ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    Muzlatish
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    Yoqish
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Rostdan ham bu mahsulotni o'chirmoqchimisiz?",
                    )
                  ) {
                    onDelete(product.id);
                  }
                }}
                className="px-3.5 py-2.5 bg-red-50 text-[#e31221] hover:bg-red-100 rounded-xl font-bold transition-colors cursor-pointer flex items-center justify-center shadow-2xs"
                title="O'chirish"
              >
                <Trash2 className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
