import React, { useState, useMemo } from 'react';
import type { Product, ProductVariant } from '../types/productTypes';
import { useAuthStore } from '@/modules/auth/authStore';

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
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  // Tanlangan variant holati
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  // Faqat faol variantlarni olish
  const availableVariants = useMemo(() => {
    return product.variants?.filter(v => v.isAvailable) || [];
  }, [product.variants]);

  // Tanlangan variantni topish
  const selectedVariant = useMemo(() => {
    if (selectedVariantId) {
      return availableVariants.find(v => v.id === selectedVariantId);
    }
    // Agar variant tanlanmagan bo'lsa, default variantni ko'rsatish
    return availableVariants.find(v => v.isDefault) || availableVariants[0];
  }, [selectedVariantId, availableVariants]);

  // Narxni formatlash
  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ');
  };

  // Variant rangini aniqlash (kichik, o'rta, katta va h.k.)
  const getVariantColor = (variantName: string) => {
    const name = variantName.toLowerCase();
    if (name.includes('kichik') || name.includes('small') || name.includes('s')) {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    }
    if (name.includes('o\'rta') || name.includes('orta') || name.includes('medium') || name.includes('m')) {
      return 'bg-green-100 text-green-800 border-green-300';
    }
    if (name.includes('katta') || name.includes('large') || name.includes('l')) {
      return 'bg-purple-100 text-purple-800 border-purple-300';
    }
    if (name.includes('xl') || name.includes('extra')) {
      return 'bg-orange-100 text-orange-800 border-orange-300';
    }
    return 'bg-stone-100 text-stone-800 border-stone-300';
  };

  const categoryName = product.category?.name || 'Kategoriya yo\'q';
  const variantsCount = product.variants?.length || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-stone-200 group">
      <div className="relative h-48 bg-stone-100">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
        ) : null}
        
        {!product.imageUrl && (
          <div className="w-full h-full flex items-center justify-center text-stone-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
            product.isAvailable ? 'bg-green-100/90 text-green-800' : 'bg-red-100/90 text-red-800'
          }`}>
            {product.isAvailable ? 'Faol' : "Nofaol"}
          </span>
        </div>

        {variantsCount > 0 && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100/90 text-blue-800 backdrop-blur-sm">
              {variantsCount} variant
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-stone-900 mb-1 truncate" title={product.name}>
          {product.name}
        </h3>
        <p className="text-xs text-stone-500 mb-3 font-medium uppercase tracking-wider">
          {categoryName}
        </p>
        
        {product.description && (
          <p className="text-sm text-stone-600 mb-4 line-clamp-2 min-h-10">
            {product.description}
          </p>
        )}

        {/* Variant tanlash tugmalari */}
        {availableVariants.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {availableVariants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                    selectedVariant?.id === variant.id
                      ? getVariantColor(variant.name) + ' ring-2 ring-offset-1 ring-stone-300'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span>{variant.name}</span>
                    {variant.isDefault && (
                      <span className="text-[9px] opacity-75">Default</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Tanlangan variant narxi */}
            {selectedVariant && (
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100">
                <div>
                  <p className="text-xs text-stone-500 mb-0.5">
                    {selectedVariant.name} variant
                  </p>
                  {selectedVariant.sku && (
                    <p className="text-[10px] text-stone-400 font-mono">
                      SKU: {selectedVariant.sku}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#e31221]">
                    {formatPrice(Number(selectedVariant.price))}
                  </span>
                  <span className="text-sm text-stone-500 ml-1">so'm</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Variantlar yo'q bo'lsa */}
        {availableVariants.length === 0 && (
          <div className="mb-4 p-3 bg-stone-50 rounded-lg border border-dashed border-stone-200 text-center">
            <p className="text-sm text-stone-400">Hozircha variantlar yo'q</p>
          </div>
        )}

        {canManage && (
          <div className="flex flex-col gap-2 pt-3 border-t border-stone-100">
            {/* Variantlarni boshqarish tugmasi */}
            <button 
              onClick={() => onManageVariants(product)} 
              className="w-full px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Variantlarni boshqarish ({variantsCount})
            </button>

            <div className="flex gap-2">
              <button 
                onClick={() => onEdit(product)} 
                className="flex-1 px-3 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors text-sm font-medium"
              >
                Tahrirlash
              </button>
              <button 
                onClick={() => onToggleStatus(product.id, !product.isAvailable)} 
                className={`flex-1 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  product.isAvailable 
                    ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' 
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                {product.isAvailable ? "Muzlatish" : 'Yoqish'}
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('Rostdan ham bu mahsulotni o\'chirmoqchimisiz?')) {
                    onDelete(product.id);
                  }
                }} 
                className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                title="O'chirish"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};