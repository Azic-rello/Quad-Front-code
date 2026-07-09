import { create } from "zustand";
import { productVariantsApi } from "./api";
import type {
  ProductVariant,
  CreateVariantDto,
  UpdateVariantDto,
} from "./types";
import toast from "react-hot-toast";

interface VariantsState {
  variants: ProductVariant[];
  isLoading: boolean;
  currentProductId: string | null;

  fetchVariants: (productId: string) => Promise<void>;
  addVariant: (dto: CreateVariantDto) => Promise<void>;
  editVariant: (id: string, dto: UpdateVariantDto) => Promise<void>;
  toggleStatus: (id: string, isAvailable: boolean) => Promise<void>;
  removeVariant: (id: string) => Promise<void>;
  reset: () => void;
}

export const useProductVariantsStore = create<VariantsState>((set, get) => ({
  variants: [],
  isLoading: false,
  currentProductId: null,

  fetchVariants: async (productId: string) => {
    set({ isLoading: true, currentProductId: productId });
    try {
      const data = await productVariantsApi.getByProductId(productId);
      set({ variants: data });
    } catch (error) {
      toast.error("Variantlarni yuklashda xatolik");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  addVariant: async (dto: CreateVariantDto) => {
    try {
      const newVariant = await productVariantsApi.create(dto);
      set((state) => ({
        variants: [...state.variants, newVariant],
      }));
      toast.success("Variant muvaffaqiyatli qo'shildi");
    } catch (error: any) {
      // 409 Conflict - duplicate variant
      if (error.response?.status === 409) {
        const message =
          error.response?.data?.message || "Bu variant allaqachon mavjud";
        toast.error(message);
        throw new Error(message);
      }

      const errorMessage =
        error.response?.data?.message || "Variant qo'shishda xatolik";
      toast.error(errorMessage);
      throw error;
    }
  },

  editVariant: async (id: string, dto: UpdateVariantDto) => {
    try {
      const updatedVariant = await productVariantsApi.update(id, dto);
      set((state) => ({
        variants: state.variants.map((v) => (v.id === id ? updatedVariant : v)),
      }));
      toast.success("Variant yangilandi");
    } catch (error: any) {
      // 409 Conflict - duplicate variant
      if (error.response?.status === 409) {
        const message =
          error.response?.data?.message || "Bu variant nomi allaqachon mavjud";
        toast.error(message);
        throw new Error(message);
      }

      const errorMessage =
        error.response?.data?.message || "Yangilashda xatolik";
      toast.error(errorMessage);
      throw error;
    }
  },

  toggleStatus: async (id: string, isAvailable: boolean) => {
    try {
      const updatedVariant = await productVariantsApi.changeStatus(id, {
        isAvailable,
      });
      set((state) => ({
        variants: state.variants.map((v) => (v.id === id ? updatedVariant : v)),
      }));
    } catch (error) {
      toast.error("Statusni o'zgartirishda xatolik");
    }
  },

  removeVariant: async (id: string) => {
    try {
      await productVariantsApi.delete(id);
      set((state) => ({
        variants: state.variants.filter((v) => v.id !== id),
      }));
      toast.success("Variant o'chirildi");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "O'chirishda xatolik");
    }
  },

  reset: () => {
    set({ variants: [], currentProductId: null });
  },
}));
