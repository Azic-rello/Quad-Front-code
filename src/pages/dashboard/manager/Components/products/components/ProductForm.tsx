import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Product, CreateProductDto, UpdateProductDto, Category } from '../types/productTypes';

const productSchema = z.object({
  name: z.string().min(2, 'Nom kamida 2 ta belgi').max(150),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Faqat kichik harf, raqam va "-"'),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url('URL noto\'g\'ri formatda').optional().or(z.literal('')),
  categoryId: z.string().uuid('Kategoriya tanlang'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product: Product | null;
  categories: Category[];
  onSubmit: (data: CreateProductDto | UpdateProductDto) => void;
  isLoading: boolean;
  onClose: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  onSubmit,
  isLoading,
  onClose,
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', slug: '', description: '', imageUrl: '', categoryId: '' },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        categoryId: product.categoryId,
      });
    } else {
      reset({ name: '', slug: '', description: '', imageUrl: '', categoryId: '' });
    }
  }, [product, reset]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-stone-900">
            {product ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Nom *</label>
              <input 
                {...register('name')} 
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#e31221] outline-none" 
                placeholder="Masalan: Pepperoni Pizza" 
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Slug *</label>
              <input 
                {...register('slug')} 
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#e31221] outline-none" 
                placeholder="pepperoni-pizza" 
              />
              {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Tavsif</label>
            <textarea 
              {...register('description')} 
              rows={3} 
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#e31221] outline-none resize-none" 
              placeholder="Mahsulot haqida ma'lumot..." 
            />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Kategoriya *</label>
            <select 
              {...register('categoryId')} 
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#e31221] outline-none bg-white"
            >
              <option value="">Tanlang...</option>
              {Array.isArray(categories) && categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Rasm URL</label>
            <input 
              {...register('imageUrl')} 
              type="url" 
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#e31221] outline-none" 
              placeholder="https://..." 
            />
            {errors.imageUrl && <p className="mt-1 text-xs text-red-600">{errors.imageUrl.message}</p>}
          </div>

          {/* Ogohlantirish: Narx variantlarda belgilanadi */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-blue-800 font-medium">Narx variantlarda belgilanadi</p>
                <p className="text-xs text-blue-600 mt-1">
                  Mahsulot yaratilgandan so'ng, uning variantlarini (katta, o'rta, kichik) qo'shib, har bir variant uchun alohida narx belgilashingiz mumkin.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-stone-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-4 py-2.5 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors font-medium"
            >
              Bekor qilish
            </button>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="flex-1 px-4 py-2.5 bg-[#e31221] text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saqlanmoqda...' : (product ? 'Yangilash' : 'Yaratish')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};