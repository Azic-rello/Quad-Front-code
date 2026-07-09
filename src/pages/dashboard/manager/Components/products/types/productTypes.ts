export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price: number;
  sku: string | null;
  isDefault: boolean;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  isActive: boolean;
}

export interface Product {
  price: any;
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
  categoryId: string;
  category: Category;
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  categoryId: string;
}

export interface UpdateProductDto {
  name?: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  categoryId?: string;
}

export interface ChangeProductStatusDto {
  isAvailable: boolean;
}

export interface QueryProductDto {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  isAvailable?: boolean;
}

export interface ProductsResponse {
  items: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}