// Backenddan keladigan kategoriya turi
export interface Category {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}


// Backend pagination javobi uchun wrapper
export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}


// Mahsulot turi
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

// DTO lar (Backend validatsiyasiga mos)
export interface CreateProductDto {
  name: string;
  slug: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
}

export interface UpdateProductDto {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
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
}

// Pagination javobi
export interface ProductsResponse {
  items: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Xatolik turi
export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}