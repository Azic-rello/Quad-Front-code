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
      return "bg-red-50 text-red-600 border-red-200 ring-red-100";
    }
    if (
      name.includes("o'rta") ||
      name.includes("orta") ||
      name.includes("medium") ||
      name.includes("m")
    ) {
      return "bg-red-100 text-red-700 border-red-300 ring-red-200";
    }
    if (
      name.includes("katta") ||
      name.includes("large") ||
      name.includes("l")
    ) {
      return "bg-red-600 text-white border-red-600 ring-red-300";
    }
    return "bg-red-50 text-red-700 border-red-200 ring-red-100";
  };

  const categoryName = product.category?.name || "Kategoriya yo'q";
  const variantsCount = product.variants?.length || 0;

  return (
    <div className="bg-white rounded-2xl border border-red-100/50 shadow-[0_4px_20px_rgb(0,0,0,0.01)] overflow-hidden hover:shadow-[0_12px_30px_rgb(227,18,33,0.06)] hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full max-w-sm animate-in fade-in duration-300">
      
      {/* ─── RASM QISMI (Balandligi h-56 dan h-44 ga tushirildi - ixchamroq) ─── */}
      <div className="relative h-44 bg-red-50/20 overflow-hidden select-none">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              const placeholder = e.currentTarget
                .nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = "flex";
            }}
          />
        ) : null}

        {!product.imageUrl && (
          <div className="w-full h-full flex flex-col items-center justify-center text-red-200 gap-1">
            <ImageIcon className="w-10 h-10 stroke-[1.2]" />
            <span className="text-[11px] font-medium text-red-400">
              Rasm yo'q
            </span>
          </div>
        )}

        {/* Status Badge (Yumaloqligi va paddingi kichraytirildi) */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide shadow-xs backdrop-blur-md ${
              product.isAvailable
                ? "bg-red-600 text-white"
                : "bg-stone-900 text-white"
            }`}
          >
            {product.isAvailable ? "Faol" : "Nofaol"}
          </span>
        </div>

        {/* Variantlar Soni Badge */}
        {variantsCount > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide bg-white text-red-600 border border-red-100 shadow-xs">
              {variantsCount} var
            </span>
          </div>
        )}
      </div>

      {/* ─── KARTA MATNI VA MA'LUMOTLARI (p-6 dan p-4 ga tushirildi) ─── */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div>
          <span className="text-[9px] font-black tracking-widest text-red-600 uppercase bg-red-50 border border-red-100/60 px-2 py-0.5 rounded-md inline-block mb-1.5">
            {categoryName}
          </span>
          <h3
            className="text-lg font-extrabold text-stone-900 truncate line-clamp-1 mb-1 group-hover:text-red-600 transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          {product.description && (
            <p className="text-xs text-stone-500 font-normal line-clamp-2 min-h-[32px] leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* ─── VARIANTLAR PANELi (Ixcham tugmalar) ─── */}
        <div className="space-y-2">
          {availableVariants.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-1">
                {availableVariants.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all duration-150 cursor-pointer active:scale-95 ${
                        isSelected
                          ? getVariantColor(variant.name) + " border-transparent ring-1 ring-offset-1 font-extrabold shadow-xs"
                          : "bg-stone-50 text-stone-600 border-stone-200/70 hover:bg-red-50 hover:text-red-600"
                      }`}
                    >
                      <span>
                        {variant.name}
                        {variant.isDefault && <span className="text-[8px] opacity-50 ml-0.5">(A)</span>}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Ixchamlashgan Narx paneli (p-4 dan p-2.5 gacha kichraydi) */}
              {selectedVariant && (
                <div className="flex items-center justify-between p-2.5 bg-red-50/20 border border-red-100/40 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider">Narxi</span>
                    {selectedVariant.sku && <span className="text-[8px] text-stone-400 font-mono">SKU: {selectedVariant.sku}</span>}
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xl font-black text-red-600 tracking-tight">
                      {formatPrice(Number(selectedVariant.price))}
                    </span>
                    <span className="text-[10px] font-extrabold text-red-600">so'm</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-2.5 bg-stone-50 border border-dashed border-stone-200 rounded-xl text-center">
              <p className="text-[11px] font-semibold text-stone-400">Variantlar yo'q</p>
            </div>
          )}
        </div>

        {/* ─── ADMIN BOSHQARUV TUGMALARI (Kichraytirilgan formatda) ─── */}
        {canManage && (
          <div className="pt-2.5 border-t border-stone-100 space-y-1.5">
            {/* Variantlarni Boshqarish (px-4 py-3 dan py-2 ga tushdi) */}
            <button
              onClick={() => onManageVariants(product)}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all duration-200 cursor-pointer active:scale-[0.99]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              Variantlar ({variantsCount})
            </button>

            {/* Pastki uchta kichik tugma */}
            <div className="flex gap-1.5">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 py-2 bg-stone-50 hover:bg-red-50 hover:text-red-600 text-stone-700 border border-stone-200/60 hover:border-red-200 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Pencil className="w-3 h-3" />
                Tahrirlash
              </button>

              <button
                onClick={() => onToggleStatus(product.id, !product.isAvailable)}
                className={`flex-1 py-2 rounded-lg font-bold text-[11px] transition-all border cursor-pointer flex items-center justify-center gap-1 ${
                  product.isAvailable
                    ? "bg-stone-950 hover:bg-stone-900 text-white border-transparent"
                    : "bg-red-50 text-red-600 border-red-200"
                }`}
              >
                {product.isAvailable ? (
                  <>
                    <EyeOff className="w-3 h-3" />
                    Muzlatish
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" />
                    Yoqish
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (window.confirm("Rostdan ham o'chirmoqchimisiz?")) {
                    onDelete(product.id);
                  }
                }}
                className="px-2.5 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center"
                title="O'chirish"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};