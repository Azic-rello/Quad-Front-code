import { $publicApi } from "../../../../../../services/api"; // Yo'lni tekshiring
import type { Category, PaginatedResponse } from "../types/productTypes";

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    // ✅ Aniq tip belgilandi: Backend Pagination formatida qaytarishi mumkin
    const response =
      await $publicApi.get<PaginatedResponse<Category>>("/categories");
    const data = response.data;

    // TypeScript endi 'data.items' borligini biladi va xato bermaydi
    if (data && Array.isArray(data.items)) {
      return data.items;
    }

    // Agar tasodifan to'g'ridan-to'g'ri massiv kelsa (xavfsizlik uchun)
    // Bu yerda type assertion ishlatamiz, chunki biz formatni tekshiryapmiz
    if (Array.isArray(data as unknown as Category[])) {
      return data as unknown as Category[];
    }

    console.warn("️ Kategoriyalar noto'g'ri formatda:", data);
    return [];
  },
};
