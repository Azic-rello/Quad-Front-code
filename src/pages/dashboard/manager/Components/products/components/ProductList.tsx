import React, { useState } from 'react';
import { 
  useProducts, 
  useCategories, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct, 
  useChangeProductStatus 
} from '../hooks/useProducts';
import { ProductForm } from './ProductForm';
import { ProductFilters } from './ProductFilters';
import type { Product, CreateProductDto, UpdateProductDto, Category } from '../types/productTypes';
import { useAuthStore } from '@/modules/auth/authStore';
import { ProductCard } from './ProductsCard';
import CategoriesManagementPage from "@/pages/dashboard/manager/Components/Category/CategoriesPage";
import { ProductVariantsModal } from './ProductVariantsModal';

interface CategoriesResponse {
  items: Category[];
}

export const ProductList: React.FC = () => {
  const { user } = useAuthStore();
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const [activeTab, setActiveTab] = useState<'foods' | 'categories'>('foods');
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [variantsProduct, setVariantsProduct] = useState<Product | null>(null);
  const [isVariantsModalOpen, setIsVariantsModalOpen] = useState<boolean>(false);

  const { data, isLoading, isError, refetch } = useProducts({
    page, 
    limit: 12, 
    search: search || undefined, 
    categoryId: categoryId || undefined,
  });

  const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories();

  const safeCategories = (
    (categoriesData as unknown as CategoriesResponse)?.items 
  ) || (categoriesData as Category[]) || [];

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const statusMutation = useChangeProductStatus();

  const handleCreate = () => { 
    setSelectedProduct(null); 
    setIsFormOpen(true); 
  };

  const handleEdit = (product: Product) => { 
    setSelectedProduct(product); 
    setIsFormOpen(true); 
  };

  const handleCloseForm = () => { 
    setIsFormOpen(false); 
    setSelectedProduct(null); 
  };

  const handleManageVariants = (product: Product) => {
    setVariantsProduct(product);
    setIsVariantsModalOpen(true);
  };

  const handleCloseVariantsModal = () => {
    setIsVariantsModalOpen(false);
    setVariantsProduct(null);
    // Refetch products to update variants count
    refetch();
  };

  const handleSubmitForm = (formData: CreateProductDto | UpdateProductDto) => {
    if (selectedProduct) {
      updateMutation.mutate({ id: selectedProduct.id, data: formData as UpdateProductDto });
    } else {
      createMutation.mutate(formData as CreateProductDto);
    }
    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Rostdan ham bu mahsulotni o'chirmoqchimisiz?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleStatus = (id: string, isAvailable: boolean) => {
    statusMutation.mutate({ id, data: { isAvailable } });
  };

  if (isError) {
    return (
      <div className="min-h-100 flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-red-200 p-8">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-stone-900 mb-2">Server xatoligi (500)</h3>
        <p className="text-stone-600 text-center max-w-md mb-6">
          Backend ma'lumotlarni qaytarishda xatolik yuz berdi. Iltimos, backend server ishlab turganini va database ulanganini tekshiring.
        </p>
        <button onClick={() => refetch()} className="px-6 py-2 bg-[#e31221] text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
          Qayta urinish
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Panel */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
        <div className="flex bg-stone-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("foods")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "foods"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Foods
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "categories"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Categories
          </button>
        </div>
      </div>

      {activeTab === "foods" ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-stone-900">Menyu Boshqaruvi</h1>
              <p className="text-stone-500 text-sm mt-1">
                Mahsulotlarni qo'shish, tahrirlash va variantlarini boshqarish
              </p>
            </div>
            {canManage && (
              <button
                onClick={handleCreate}
                className="px-5 py-2.5 bg-[#e31221] text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2 shadow-sm self-start sm:self-auto text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Yangi mahsulot
              </button>
            )}
          </div>

          <ProductFilters
            search={search}
            onSearchChange={setSearch}
            categoryId={categoryId}
            onCategoryChange={setCategoryId}
            categories={safeCategories}
            isLoadingCategories={isCategoriesLoading}
            hideSearch={false}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm h-80 animate-pulse border border-stone-100"
                />
              ))}
            </div>
          ) : (
            <>
              {data?.items && data.items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {data.items.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleStatus={handleToggleStatus}
                      onManageVariants={handleManageVariants}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-stone-300">
                  <svg className="mx-auto h-12 w-12 text-stone-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="text-lg font-medium text-stone-900">Mahsulotlar topilmadi</h3>
                  <p className="text-stone-500 mt-1">
                    Qidiruv shartlarini o'zgartiring yoki yangi mahsulot qo'shing
                  </p>
                </div>
              )}

              {data?.meta && data.meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 transition-colors text-sm font-medium"
                  >
                    Oldingi
                  </button>
                  <span className="px-4 py-2 text-sm text-stone-600 font-medium bg-white border border-stone-200 rounded-lg">
                    {data.meta.page} / {data.meta.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= data.meta.totalPages}
                    className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 transition-colors text-sm font-medium"
                  >
                    Keyingi
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <CategoriesManagementPage />
      )}

      {/* Product Form Modal */}
      {isFormOpen && (
        <ProductForm
          product={selectedProduct}
          categories={safeCategories}
          onSubmit={handleSubmitForm}
          isLoading={createMutation.isPending || updateMutation.isPending}
          onClose={handleCloseForm}
        />
      )}

      {/* Variants Modal */}
      {isVariantsModalOpen && (
        <ProductVariantsModal
          product={variantsProduct}
          isOpen={isVariantsModalOpen}
          onClose={handleCloseVariantsModal}
        />
      )}
    </div>
  );
};