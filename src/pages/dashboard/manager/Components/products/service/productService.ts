import { $api } from '../../../../../../services/api'; // Loyihangizdagi api manziliga qarab to'g'rilang
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ChangeProductStatusDto,
  QueryProductDto,
  ProductsResponse,
  Category,
} from '../types/productTypes';

export const productService = {
  getAll: async (query: QueryProductDto): Promise<ProductsResponse> => {
    const response = await $api.get<ProductsResponse>('/products', { params: query });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await $api.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await $api.post<Product>('/products', data);
    return response.data;
  },

  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    const response = await $api.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  changeStatus: async (id: string, data: ChangeProductStatusDto): Promise<Product> => {
    const response = await $api.patch<Product>(`/products/${id}/status`, data);
    return response.data;
  },

  delete: async (id: string): Promise<Product> => {
    const response = await $api.delete<Product>(`/products/${id}`);
    return response.data;
  },
};

// Kategoriyalar uchun alohida service
export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await $api.get<Category[]>('/categories');
    return response.data;
  },
};