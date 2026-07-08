import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { ProductVariant } from "./types";
import { useProductVariantsStore } from "./useProductVariantsStore";


// ✅ variantSchema ni yaratish
const variantSchema = z.object({
  name: z.string().min(2, "Nom kamida 2 ta belgi bo'lishi kerak").max(30),
  price: z.coerce.number().min(0, "Narx manfiy bo'lishi mumkin emas"),
  sku: z.string().optional().or(z.literal("")),
  isDefault: z.boolean().default(false),
});

type VariantFormData = z.infer<typeof variantSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  editingVariant?: ProductVariant | null;
}

export const VariantFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  productId,
  editingVariant,
}) => {
  const { addVariant, editVariant } = useProductVariantsStore();

  // ✅ handleSubmit va onSubmit nomlarini ajratish
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VariantFormData>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      name: "",
      price: 0,
      sku: "",
      isDefault: false,
    },
  });

  useEffect(() => {
    if (editingVariant) {
      setValue("name", editingVariant.name);
      setValue("price", editingVariant.price);
      setValue("sku", editingVariant.sku || "");
      setValue("isDefault", editingVariant.isDefault);
    } else {
      reset({
        name: "",
        price: 0,
        sku: "",
        isDefault: false,
      });
    }
  }, [editingVariant, setValue, reset]);

  // ✅ Submit funksiyasi uchun alohida nom
  const onSubmitForm = async (data: VariantFormData) => {
    try {
      if (editingVariant) {
        await editVariant(editingVariant.id, data);
      } else {
        await addVariant({ ...data, productId });
      }
      onClose();
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {editingVariant ? "Variantni tahrirlash" : "Yangi variant qo'shish"}
        </h2>

        {/* ✅ handleSubmit(onSubmitForm) - to'g'ri */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              {...register("name")}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Masalan: Katta, O'rta"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Narx
            </label>
            <input
              type="number"
              {...register("price")}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
            )}
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              SKU (ixtiyoriy)
            </label>
            <input
              {...register("sku")}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="PIZZA-LARGE"
            />
          </div>

          {/* Is Default */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register("isDefault")}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Standart variant
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};