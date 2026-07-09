// src/pages/dashboard/waiter/components/VariantSelectorModal.tsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Product, ProductVariant } from "../products/types/productTypes";


interface Props {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (variant: ProductVariant, quantity: number) => void;
  // ✅ Yangi: Tahrirlash rejimi uchun boshlang'ich qiymatlar
  initialVariantId?: string | null;
  initialQuantity?: number;
}

const VariantSelectorModal: React.FC<Props> = ({
  product,
  isOpen,
  onClose,
  onConfirm,
  initialVariantId,
  initialQuantity,
}) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen && product.variants) {
      // ✅ Agar initialVariantId berilgan bo'lsa (tahrirlash), uni ishlatamiz
      // Aks holda default yoki birinchi variantni tanlaymiz (yangi qo'shish)
      if (initialVariantId) {
        setSelectedVariantId(initialVariantId);
        setQuantity(initialQuantity || 1);
      } else {
        const defaultVar =
          product.variants.find((v) => v.isDefault) || product.variants[0];
        setSelectedVariantId(defaultVar?.id || null);
        setQuantity(1);
      }
    }
  }, [isOpen, product, initialVariantId, initialQuantity]);

  if (!isOpen) return null;

  const selectedVariant = product.variants?.find(
    (v) => v.id === selectedVariantId,
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <div>
            <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
            <p className="text-xs text-gray-500">
              {initialVariantId
                ? "Buyurtmani o'zgartirish"
                : "O'lchamni tanlang"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body: Variants List */}
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {product.variants?.map((variant) => (
            <div
              key={variant.id}
              onClick={() => setSelectedVariantId(variant.id)}
              className={`
                flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all
                ${
                  selectedVariantId === variant.id
                    ? "border-red-500 bg-red-50 ring-1 ring-red-500"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedVariantId === variant.id ? "border-red-500" : "border-gray-300"}`}
                >
                  {selectedVariantId === variant.id && (
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                  )}
                </div>
                <span className="font-medium text-gray-700">
                  {variant.name}
                </span>
              </div>
              <span className="font-bold text-gray-900">
                {variant.price.toLocaleString()} so'm
              </span>
            </div>
          ))}
        </div>

        {/* Footer: Quantity & Confirm */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between gap-4">
          <div className="flex items-center bg-white border rounded-lg px-2 py-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded"
            >
              -
            </button>
            <span className="w-8 text-center font-bold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded"
            >
              +
            </button>
          </div>

          <button
            disabled={!selectedVariant}
            onClick={() => {
              if (selectedVariant) {
                onConfirm(selectedVariant, quantity);
                onClose();
              }
            }}
            className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95"
          >
            {initialVariantId ? "Yangilash" : "Qo'shish"} (
            {selectedVariant
              ? (selectedVariant.price * quantity).toLocaleString()
              : "0"}{" "}
            so'm)
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantSelectorModal;
