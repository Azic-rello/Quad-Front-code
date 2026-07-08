
export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price: number; // Backend Decimal qaytargani uchun string bo'lishi mumkin, lekin Number() bilan ishlaymiz
  sku: string | null;
  isDefault: boolean;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVariantDto {
  productId: string;
  name: string;
  price: number;
  sku?: string;
  isDefault?: boolean;
  isAvailable?: boolean;
}

export interface UpdateVariantDto {
  name?: string;
  price?: number;
  sku?: string;
  isDefault?: boolean;
  isAvailable?: boolean;
}

export interface ChangeStatusDto {
  isAvailable: boolean;
}

// Query parametrlari uchun
export interface GetVariantsParams {
  productId?: string;
  search?: string;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}