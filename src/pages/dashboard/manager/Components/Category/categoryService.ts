import { $api } from "../../../../../services/api";

// 📋 Interfeyslar
export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface CategoryResponse {
  items: Category[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 🚀 API so'rovlar obyekti
export const categoryService = {
getAll: async (page = 1, limit = 10, search = "") => {
  const params = new URLSearchParams();

  params.append("page", page.toString());
  params.append("limit", limit.toString());

  if (search) {
    params.append("search", search);
  }

  const response = await $api.get(`/categories`);

  console.log("STATUS =", response.status);
  console.log("DATA =", response.data);

  return response.data;
},

  // Bitta kategoriyani ID bo'yicha olish
  getOne: async (id: string) => {
    const response = await $api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  // Yangi kategoriya yaratish
  create: async (data: { name: string; slug: string; imageUrl?: string }) => {
    const response = await $api.post<Category>("/categories", data);
    return response.data;
  },

  // Kategoriyani tahrirlash (Patch ishlatilgani uchun ba'zi maydonlar ixtiyoriy)
  update: async (id: string, data: { name?: string; slug?: string; imageUrl?: string }) => {
    const response = await $api.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  // Statusni yoqish/o'chirish (isActive)
  changeStatus: async (id: string, isActive: boolean) => {
    const response = await $api.patch<Category>(`/categories/${id}/status`, { isActive });
    return response.data;
  },

  // O'chirish
  delete: async (id: string) => {
    const response = await $api.delete<Category>(`/categories/${id}`);
    return response.data;
  },
};