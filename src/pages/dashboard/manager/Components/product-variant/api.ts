import { $api } from "@/services/api";
import type {
  ProductVariant,
  CreateVariantDto,
  UpdateVariantDto,
  ChangeStatusDto,
  GetVariantsParams,
  PaginatedResponse,
} from "./types";

const BASE_URL = "/product-variants";

export const productVariantsApi = {
  getAll: async (params?: GetVariantsParams): Promise<PaginatedResponse<ProductVariant>> => {
    const response = await $api.get(BASE_URL, { params });
    return response.data;
  },

  getById: async (id: string): Promise<ProductVariant> => {
    const response = await $api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  getByProductId: async (productId: string): Promise<ProductVariant[]> => {
    const response = await $api.get(`${BASE_URL}/product/${productId}`);
    return response.data;
  },

  create: async (dto: CreateVariantDto): Promise<ProductVariant> => {
    const response = await $api.post(BASE_URL, dto);
    return response.data;
  },

  update: async (id: string, dto: UpdateVariantDto): Promise<ProductVariant> => {
    const response = await $api.patch(`${BASE_URL}/${id}`, dto);
    return response.data;
  },

  changeStatus: async (id: string, dto: ChangeStatusDto): Promise<ProductVariant> => {
    const response = await $api.patch(`${BASE_URL}/${id}/status`, dto);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await $api.delete(`${BASE_URL}/${id}`);
  },
};