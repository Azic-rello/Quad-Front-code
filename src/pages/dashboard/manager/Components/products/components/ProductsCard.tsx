import React from 'react';
import type { Product } from '../types/productTypes';
import { useAuthStore } from '@/modules/auth/authStore';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isAvailable: boolean) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const { user } = useAuthStore();
  // Role type bo'lgani uchun string bilan solishtiramiz
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-stone-200 group">
      <div className="relative h-48 bg-stone-100">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
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
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-stone-900 mb-1 truncate">{product.name}</h3>
        <p className="text-xs text-stone-500 mb-3 font-medium uppercase tracking-wider">{product.category.name}</p>
        
        {product.description && (
          <p className="text-sm text-stone-600 mb-4 line-clamp-2 min-h-10">{product.description}</p>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-black text-[#e31221]">
            {product.price.toLocaleString('uz-UZ')} so'm
          </span>
        </div>

        {canManage && (
          <div className="flex gap-2 pt-3 border-t border-stone-100">
            <button onClick={() => onEdit(product)} className="flex-1 px-3 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors text-sm font-medium">
              Tahrirlash
            </button>
            <button onClick={() => onToggleStatus(product.id, !product.isAvailable)} 
              className={`flex-1 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                product.isAvailable ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}>
              {product.isAvailable ? "Muzlatish" : 'Yoqish'}
            </button>
            <button onClick={() => onDelete(product.id)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};