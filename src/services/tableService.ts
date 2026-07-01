import axios from 'axios';

// Backend manzili (o'zingiznikiga moslang)
const API_URL = 'http://localhost:3000/tables'; 

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'DISABLED';

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  occupiedById?: string | null;
  occupiedAt?: string | null;
  occupiedBy?: {
    id: string;
    fullName: string;
    username: string;
    role: string;
  } | null;
}

export interface QueryTableParams {
  page?: number;
  limit?: number;
  status?: TableStatus;
}

export interface MetaData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TablesResponse {
  items: Table[];
  meta: MetaData;
}

export const tableService = {
  // 1. Barcha stollarni pagination va filter bilan olish
  getAll: async (params?: QueryTableParams) => {
    const response = await axios.get<TablesResponse>(API_URL, { params });
    return response.data;
  },

  // 2. Yangi stol yaratish
  create: async (data: { number: number; capacity: number }) => {
    const response = await axios.post<Table>(API_URL, data);
    return response.data;
  },

  // 3. Stolni tahrirlash (faqat sig'imini)
  update: async (id: string, data: { capacity: number }) => {
    const response = await axios.patch<Table>(`${API_URL}/${id}`, data);
    return response.data;
  },

  // 4. Statusni o'zgartirish (AVAILABLE, DISABLED va h.k.)
  changeStatus: async (id: string, status: TableStatus) => {
    const response = await axios.patch<Table>(`${API_URL}/${id}/status`, { status });
    return response.data;
  },

  // 5. Stolni bo'shatish
  release: async (id: string) => {
    const response = await axios.patch<Table>(`${API_URL}/${id}/release`);
    return response.data;
  },

  // 6. Stolni o'chirish
  delete: async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
};