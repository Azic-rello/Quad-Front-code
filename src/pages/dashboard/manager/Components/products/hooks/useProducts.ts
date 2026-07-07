import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { productService, categoryService } from '../service/productService';
import type {
  QueryProductDto,
  CreateProductDto,
  UpdateProductDto,
  ChangeProductStatusDto,
  ProductsResponse,
  Product,
  ApiErrorResponse,
  Category,
} from '../types/productTypes';

// Query kalitlari
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: QueryProductDto) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    return axiosError.response?.data?.message || 'Xatolik yuz berdi';
  }
  return 'Noma\'lum xatolik';
};

// Mahsulotlarni olish
export const useProducts = (query: QueryProductDto = {}) => {
  return useQuery<ProductsResponse, AxiosError<ApiErrorResponse>>({
    queryKey: productKeys.list(query),
    queryFn: () => productService.getAll(query),
    staleTime: 5 * 60 * 1000,
  });
};

// ✅ Kategoriyalarni olish (Yangi qo'shildi)
export const useCategories = () => {
  return useQuery<Category[], AxiosError<ApiErrorResponse>>({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
    staleTime: 10 * 60 * 1000,
  });
};

// Mahsulot yaratish
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, AxiosError<ApiErrorResponse>, CreateProductDto>({
    mutationFn: (data) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Mahsulot muvaffaqiyatli yaratildi');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// Mahsulotni yangilash
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, AxiosError<ApiErrorResponse>, { id: string; data: UpdateProductDto }>({
    mutationFn: ({ id, data }) => productService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      toast.success('Mahsulot muvaffaqiyatli yangilandi');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// Status o'zgartirish
export const useChangeProductStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, AxiosError<ApiErrorResponse>, { id: string; data: ChangeProductStatusDto }>({
    mutationFn: ({ id, data }) => productService.changeStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      toast.success(`Mahsulot ${variables.data.isAvailable ? 'yoqildi' : "o'chirildi"}`);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

// O'chirish
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, AxiosError<ApiErrorResponse>, string>({
    mutationFn: (id) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success("Mahsulot muvaffaqiyatli o'chirildi");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};