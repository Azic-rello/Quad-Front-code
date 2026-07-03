import axios from 'axios';
import { useAuthStore } from '../../../../../modules/auth/authStore';

const API = axios.create({
  baseURL: 'http://localhost:3000/tables',
});

API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken || useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const tableService = {
  getAll: async (page = 1, limit = 8, status = '') => {
    const response = await API.get('', {
      params: { page, limit, ...(status ? { status } : {}) }
    });
    return response.data;
  },

  create: async (data: { number: number; capacity: number }) => {
    const response = await API.post('', data);
    return response.data;
  },

  update: async (id: string, data: { capacity: number }) => {
    const response = await API.patch(`/${id}`, data);
    return response.data;
  },

  occupy: async (id: string) => {
    const response = await API.patch(`/${id}/occupy`);
    return response.data;
  },

  release: async (id: string) => {
    const response = await API.patch(`/${id}/release`);
    return response.data;
  },

  changeStatus: async (id: string, status: string) => {
    const response = await API.patch(`/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await API.delete(`/${id}`);
    return response.data;
  }
};