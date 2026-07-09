// src/pages/dashboard/manager/Components/orderj/orderStore.ts

import { create } from "zustand";
import { orderApi } from "./orderApi";
import type {
  Order,
  OrdersResponse,
  CreateOrderDto,
  AddOrderItemDto,
  UpdateOrderStatusDto,
} from "./orderTypes";

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  meta: {
    page: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;

  fetchOrders: (page?: number, limit?: number) => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  createOrder: (dto: CreateOrderDto) => Promise<Order>;
  addItemToOrder: (orderId: string, dto: AddOrderItemDto) => Promise<Order>;
  updateOrderStatus: (
    orderId: string,
    dto: UpdateOrderStatusDto,
  ) => Promise<void>;
  clearCurrentOrder: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  meta: { page: 1, total: 0, totalPages: 0 },
  isLoading: false,
  error: null,

  fetchOrders: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response: OrdersResponse = await orderApi.getAll({ page, limit });
      set({
        orders: response.items,
        meta: {
          page: response.meta.page,
          total: response.meta.total,
          totalPages: response.meta.totalPages,
        },
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Buyurtmalarni yuklashda xatolik";
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOrderById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const order: Order = await orderApi.getById(id);
      set({ currentOrder: order });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Buyurtmani topishda xatolik";
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  createOrder: async (dto: CreateOrderDto) => {
    set({ isLoading: true, error: null });
    try {
      const newOrder: Order = await orderApi.create(dto);
      return newOrder;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Buyurtma yaratishda xatolik";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  addItemToOrder: async (orderId: string, dto: AddOrderItemDto) => {
    set({ isLoading: true, error: null });
    try {
      const updatedOrder: Order = await orderApi.addItem(orderId, dto);

      if (get().currentOrder?.id === orderId) {
        set({ currentOrder: updatedOrder });
      }

      return updatedOrder;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Mahsulot qo'shishda xatolik";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateOrderStatus: async (orderId: string, dto: UpdateOrderStatusDto) => {
    set({ isLoading: true, error: null });
    try {
      await orderApi.updateStatus(orderId, dto);

      if (get().currentOrder?.id === orderId) {
        const updatedOrder = { ...get().currentOrder!, status: dto.status };
        set({ currentOrder: updatedOrder });
      }

      await get().fetchOrders(get().meta.page);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Statusni yangilashda xatolik";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  clearCurrentOrder: () => {
    set({ currentOrder: null, error: null });
  },
}));
