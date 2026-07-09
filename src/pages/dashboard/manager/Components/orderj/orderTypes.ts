// src/pages/dashboard/manager/Components/orderj/orderTypes.ts

export enum OrderStatusEnum {
  OPEN = 'OPEN',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum TableStatusEnum {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  DISABLED = 'DISABLED',
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
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
  username: string;
}

export interface TableSimple {
  id: string;
  number: number;
  status: TableStatusEnum;
}

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

export interface QueryOrderDto {
  page?: number;
  limit?: number;
  status?: OrderStatusEnum;
}

export interface OrdersResponse {
  items: Order[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}