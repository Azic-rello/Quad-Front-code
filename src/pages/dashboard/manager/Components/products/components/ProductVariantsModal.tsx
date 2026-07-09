import React, { useEffect, useState } from 'react';
import type { Product, ProductVariant } from '../types/productTypes';
import { useProductVariantsStore } from '../../product-variant/useProductVariantsStore';
import { VariantFormModal } from '../../product-variant/VariantFormModal';


interface ProductVariantsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductVariantsModal: React.FC<ProductVariantsModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { variants, isLoading, fetchVariants, toggleStatus, removeVariant } = useProductVariantsStore();
  const [isVariantFormOpen, setIsVariantFormOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    if (product && isOpen) {
      fetchVariants(product.id);
    }
  }, [product, isOpen, fetchVariants]);

  const handleAddNew = () => {
    setEditingVariant(null);
    setIsVariantFormOpen(true);
  };

  const handleEdit = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setIsVariantFormOpen(true);
  };

  const handleCloseVariantForm = () => {
    setIsVariantFormOpen(false);
    setEditingVariant(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Rostdan ham bu variantni o\'chirmoqchimisiz?')) {
      await removeVariant(id);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                {product.name} - Variantlar
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                Mahsulotning o'lchamlari va variantlarini boshqaring
              </p>
            </div>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Add Button */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-stone-900">
                  Barcha variantlar ({variants.length})
                </h3>
                <p className="text-sm text-stone-500 mt-1">
                  Har bir variant uchun alohida narx va xususiyatlar belgilang
                </p>
              </div>
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 px-4 py-2 bg-[#e31221] text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Yangi variant
              </button>
            </div>

            {/* Loading */}
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-stone-100 rounded-lg h-20 animate-pulse" />
                ))}
              </div>
            ) : variants.length === 0 ? (
              <div className="text-center py-12 bg-stone-50 rounded-lg border-2 border-dashed border-stone-200">
                <svg className="mx-auto h-12 w-12 text-stone-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-lg font-medium text-stone-900 mb-1">
                  Hozircha variantlar yo'q
                </h3>
                <p className="text-stone-500 text-sm mb-4">
                  Mahsulot uchun birinchi variantni qo'shing
                </p>
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 bg-[#e31221] text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                >
                  Variant qo'shish
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-200">
                  <thead className="bg-stone-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Narx
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Holat
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Amallar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-stone-200">
                    {variants.map((variant) => (
                      <tr key={variant.id} className="hover:bg-stone-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-stone-900">
                              {variant.name}
                            </span>
                            {variant.isDefault && (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                Standart
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-stone-900">
                          {Number(variant.price).toLocaleString('uz-UZ')} so'm
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-500">
                          {variant.sku || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => toggleStatus(variant.id, !variant.isAvailable)}
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              variant.isAvailable
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {variant.isAvailable ? 'Faol' : 'Nofaol'}
                          </button>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(variant)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Tahrirlash"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(variant.id)}
                              className="text-red-600 hover:text-red-900 disabled:opacity-30 disabled:cursor-not-allowed"
                              disabled={variant.isDefault}
                              title={variant.isDefault ? "Default variantni o'chirib bo'lmaydi" : "O'chirish"}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Variant Form Modal */}
      {isVariantFormOpen && product && (
        <VariantFormModal
          isOpen={isVariantFormOpen}
          onClose={handleCloseVariantForm}
          productId={product.id}
          editingVariant={editingVariant}
        />
      )}
    </>
  );
};