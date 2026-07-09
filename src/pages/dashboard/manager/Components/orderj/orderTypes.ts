// src/pages/dashboard/manager/Components/orderj/orderTypes.ts

import type { Role } from "@/modules/auth/authTypes"; // Sizning loyihangizdagi Role tipi joylashuvi

// Enumlar
export enum OrderStatusEnum {
  OPEN = "OPEN",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export enum TableStatusEnum {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  RESERVED = "RESERVED",
  DISABLED = "DISABLED",
}

// Kichik tiplar (Nested types)
export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
}

export interface Product {
  variants: any;
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  category: Category;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number; // Backend Decimalni string qaytarishi mumkin, lekin UI da number qulayroq
  product: Product;
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variant: ProductVariant;
}

export interface UserSimple {
  id: string;
  fullName: string;
  role: Role;
}

export interface TableSimple {
  id: string;
  number: number;
  status: TableStatusEnum;
}

// Asosiy Order interfeysi
export interface Order {
  id: string;
  tableId: string;
  waiterId: string;
  status: OrderStatusEnum;
  subtotal: number;
  serviceFee: number;
  total: number;
  createdAt: string;
  updatedAt: string;

  table: TableSimple;
  waiter: UserSimple;
  items: OrderItem[];
}

// DTOs (Request uchun)
export interface CreateOrderDto {
  tableId: string;
}

export interface AddOrderItemDto {
  variantId: string;
  quantity: number;
}

export interface UpdateOrderStatusDto {
  status: OrderStatusEnum;
}

// Query parametrlari
export interface QueryOrderDto {
  page?: number;
  limit?: number;
}

// API Response
export interface OrdersResponse {
  items: Order[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
