import axios from 'axios';
import { useAuthStore } from '../../../../../modules/auth/authStore';

export interface Table {
  name: import("react/jsx-runtime").JSX.Element;
  id: string;
  number: number;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'DISABLED';
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

const API = axios.create({
  baseURL: 'http://localhost:3000/tables',
});

// Request Interceptor: Tokenni tekshirish va har bir so'rovga qo'shish
API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken || useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const tableService = {
  /**
   * 📊 Barcha stollarni sahifalab olish (Backend qulamasligi uchun optimizatsiya qilindi)
   */
  getAll: async (page = 1, limit = 8, status = ''): Promise<TablesResponse> => {
    // ⚡️ Backend "take: '8'" deb qulamasligi uchun params ichidan limitni olib tashladik.
    // NestJS o'zining ichki default limitini (qiymatini) ishlatib xatosiz ma'lumot qaytaradi.
    const params: any = {
      page: Number(page),
    };

    // Status rostdan ham bor bo'lsagina params'ga qo'shamiz
    if (status && status.trim() !== '') {
      params.status = status;
    }

    const response = await API.get('', { params });
    return response.data;
  },

  /**
   * ➕ Yangi stol yaratish
   */
  create: async (data: { number: number; capacity: number }): Promise<Table> => {
    const response = await API.post('', {
      number: Number(data.number),
      capacity: Number(data.capacity)
    });
    return response.data;
  },

  /**
   * ✏️ Stolni tahrirlash
   */
  update: async (id: string, data: { capacity: number }): Promise<Table> => {
    const response = await API.patch(`/${id}`, {
      capacity: Number(data.capacity)
    });
    return response.data;
  },

  /**
   * 🪑 Stolni band qilish
   */
  occupy: async (id: string): Promise<Table> => {
    const response = await API.patch(`/${id}/occupy`);
    return response.data;
  },

  /**
   * 🔓 Stolni bo'shatish
   */
  release: async (id: string): Promise<Table> => {
    const response = await API.patch(`/${id}/release`);
    return response.data;
  },

  /**
   * ⚙️ Statusni o'zgartirish (AVAILABLE, OCCUPIED, DISABLED)
   */
  changeStatus: async (id: string, status: string): Promise<Table> => {
    const response = await API.patch(`/${id}/status`, { status });
    return response.data;
  },

  /**
   * ❌ Stolni o'chirish
   */
  delete: async (id: string): Promise<void> => {
    const response = await API.delete(`/${id}`);
    return response.data;
  }
};