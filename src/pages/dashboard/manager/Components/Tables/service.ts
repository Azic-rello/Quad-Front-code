import { $api } from "../../../../../services/api"; // Loyihangdagi global api.ts yo'liga qarab to'g'rilab olasan

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "DISABLED";
  occupiedBy?: {
    fullName: string;
  };
}

export interface TablesResponse {
  data: Table[];
  items: Table[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const tableService = {
  /**
   * 📊 Barcha stollarni olish (Limitni oshirdik, hammasi kelishi uchun)
   */
  getAll: async (
    page = 1,
    limit = 100,
    status = "",
  ): Promise<TablesResponse> => {
    const params: any = {
      page: Number(page),
    };

    if (status && status.trim() !== "") {
      params.status = status;
    }

    // Umumiy xavfsiz $api orqali /tables'ga so'rov yuboriladi
    const response = await $api.get<unknown>("/tables", { params });

    // Response formati o'ralgan bo'lishi ehtimoli uchun xavfsiz qaytarish
    if (response && typeof response === "object" && "data" in response) {
      return (response as { data: TablesResponse }).data;
    }
    return response as unknown as TablesResponse;
  },

  /**
   * ➕ Yangi stol yaratish
   */
  create: async (data: {
    number: number;
    capacity: number;
  }): Promise<Table> => {
    const response = await $api.post<Table>("/tables", {
      number: Number(data.number),
      capacity: Number(data.capacity),
    });
    return response.data;
  },

  /**
   * ✏️ Stolni tahrirlash
   */
  update: async (id: string, data: { capacity: number }): Promise<Table> => {
    const response = await $api.patch<Table>(`/tables/${id}`, {
      capacity: Number(data.capacity),
    });
    return response.data;
  },

  /**
   * 🪑 Stolni band qilish
   */
  occupy: async (id: string): Promise<Table> => {
    const response = await $api.patch<Table>(`/tables/${id}/occupy`);
    return response.data;
  },

  /**
   * 🔓 Stolni bo'shatish
   */
  release: async (id: string): Promise<Table> => {
    const response = await $api.patch<Table>(`/tables/${id}/release`);
    return response.data;
  },

  /**
   * ⚙️ Statusni o'zgartirish (AVAILABLE, OCCUPIED, DISABLED)
   */
  changeStatus: async (id: string, status: string): Promise<Table> => {
    const response = await $api.patch<Table>(`/tables/${id}/status`, {
      status,
    });
    return response.data;
  },

  /**
   * ❌ Stolni o'chirish
   */
  delete: async (id: string): Promise<void> => {
    const response = await $api.delete<void>(`/tables/${id}`);
    return response.data;
  },
};
