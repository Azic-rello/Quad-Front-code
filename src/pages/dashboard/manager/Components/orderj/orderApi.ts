// src/pages/dashboard/manager/Components/orderj/orderApi.ts

import { $api } from "@/services/api"; // Sizning global api instansiyangiz
import type {
  Order,
  CreateOrderDto,
  AddOrderItemDto,
  UpdateOrderStatusDto,
  OrdersResponse,
  QueryOrderDto,
} from "./orderTypes";

export const orderApi = {
  getAll: async (params?: QueryOrderDto): Promise<OrdersResponse> => {
    const { data } = await $api.get<OrdersResponse>("/orders", { params });
    return data;
  },

  getById: async (id: string): Promise<Order> => {
    const { data } = await $api.get<Order>(`/orders/${id}`);
    return data;
  },

  create: async (dto: CreateOrderDto): Promise<Order> => {
    const { data } = await $api.post<Order>("/orders", dto);
    return data;
  },

  addItem: async (orderId: string, dto: AddOrderItemDto): Promise<Order> => {
    const { data } = await $api.post<Order>(`/orders/${orderId}/items`, dto);
    return data;
  },

  updateStatus: async (
    orderId: string,
    dto: UpdateOrderStatusDto,
  ): Promise<Order> => {
    const { data } = await $api.patch<Order>(`/orders/${orderId}/status`, dto);
    return data;
  },

  delete: async (orderId: string): Promise<void> => {
    await $api.delete(`/orders/${orderId}`);
  },
};
