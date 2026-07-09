// 📁 productService.ts ni quyidagicha yangila:

import { $api } from "../../../../../../services/api"; // 👈 Faqat himoyalangan $api ni olamiz
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ChangeProductStatusDto,
  QueryProductDto,
  ProductsResponse,
  Category,
} from "../types/productTypes";

export const productService = {
  // ✅ Manager panelida majburiy token bilan so'rov yuborish uchun $api qilamiz
  getAll: async (query: QueryProductDto): Promise<ProductsResponse> => {
    const response = await $api.get<ProductsResponse>("/products", {
      params: query,
    });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await $api.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await $api.post<Product>("/products", data);
    return response.data;
  },

  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    const response = await $api.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  changeStatus: async (
    id: string,
    data: ChangeProductStatusDto,
  ): Promise<Product> => {
    const response = await $api.patch<Product>(`/products/${id}/status`, data);
    return response.data;
  },

  delete: async (id: string): Promise<Product> => {
    const response = await $api.delete<Product>(`/products/${id}`);
    return response.data;
  },
};

export const categoryService = {
  // ✅ Kategoriyalarni ham token bilan himoyalangan holda olamiz
  getAll: async (): Promise<Category[]> => {
    const response = await $api.get<Category[]>("/categories");
    return response.data;
  },
};
