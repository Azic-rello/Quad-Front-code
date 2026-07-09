import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { ProductVariant } from "./types";
import { useProductVariantsStore } from "./useProductVariantsStore";
import { X, Layers, DollarSign, Barcode, Check } from "lucide-react";
import toast from "react-hot-toast";

// ✅ To'g'ri schema - price uchun coerce
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

  const onSubmitForm = async (data: VariantFormData) => {
    try {
      if (editingVariant) {
        await editVariant(editingVariant.id, data);
        toast.success("Variant muvaffaqiyatli yangilandi");
      } else {
        await addVariant({ ...data, productId });
        toast.success("Variant muvaffaqiyatli qo'shildi");
      }
      onClose();
    } catch (error: any) {
      console.error("Variant saqlashda xatolik:", error);
      if (error.response?.status === 409) {
        toast.error("Bu variant allaqachon mavjud! Boshqa nom yoki SKU kiriting.");
      } else {
        toast.error(error.response?.data?.message || "Xatolik yuz berdi");
      }
    }
  };

  if (!isOpen) return null;

  return (
    // Orqa fon shaffof va orqadagi Menyuni chiroyli ko'rsatib turishi uchun backdrop-blur effektlari qo'shildi
    <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      
      <div className="bg-white rounded-[28px] w-full max-w-md border border-red-100/80 shadow-[0_24px_60px_rgba(227,18,33,0.12)] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* MODAL TEPA QISMI (HEADER) */}
        <div className="relative px-6 pt-6 pb-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black tracking-widest text-red-600 uppercase bg-red-50 px-2.5 py-1 rounded-lg inline-block mb-1">
              Assortiment
            </span>
            <h2 className="text-xl font-extrabold text-stone-900">
              {editingVariant ? "Variantni tahrirlash" : "Yangi variant qo'shish"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* FORMA QISMI */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-4">
          
          {/* INPUT: Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-red-500" />
              Variant Nomi
            </label>
            <div className="relative">
              <input
                {...register("name")}
                className={`w-full px-4 py-3 bg-stone-50 border rounded-xl font-medium text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none transition-all ${
                  errors.name
                    ? "border-red-500 ring-2 ring-red-100"
                    : "border-stone-200 focus:border-red-600 focus:ring-4 focus:ring-red-100"
                }`}
                placeholder="Masalan: Katta, O'rta, 1 litr"
              />
            </div>
            {errors.name && (
              <p className="text-red-600 text-xs font-semibold pl-1 animate-in slide-in-from-left-2 duration-200">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* INPUT: Price */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-red-500" />
              Narxi (so'm)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                {...register("price")}
                className={`w-full px-4 py-3 bg-stone-50 border rounded-xl font-bold text-sm text-stone-900 focus:bg-white focus:outline-none transition-all ${
                  errors.price
                    ? "border-red-500 ring-2 ring-red-100"
                    : "border-stone-200 focus:border-red-600 focus:ring-4 focus:ring-red-100"
                }`}
              />
            </div>
            {errors.price && (
              <p className="text-red-600 text-xs font-semibold pl-1 animate-in slide-in-from-left-2 duration-200">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* INPUT: SKU */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <Barcode className="w-3.5 h-3.5 text-red-500" />
              SKU Kod (ixtiyoriy)
            </label>
            <input
              {...register("sku")}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-red-600 focus:bg-white rounded-xl font-mono text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all"
              placeholder="PIZZA-LARGE-01"
            />
          </div>

          {/* CHECKBOX: Is Default */}
          <label className="flex items-center p-3 bg-stone-50 border border-stone-100 rounded-xl cursor-pointer hover:bg-red-50/40 hover:border-red-100/50 transition-colors group select-none">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                {...register("isDefault")}
                className="sr-only peer" // Standart checkboxni yashirib chiroyli checkbox yasaymiz
              />
              <div className="w-5 h-5 border-2 border-stone-300 peer-checked:border-red-600 peer-checked:bg-red-600 rounded-md transition-all flex items-center justify-center text-white">
                <Check className="w-3.5 h-3.5 stroke-[3] scale-0 peer-checked:scale-100 transition-transform" />
              </div>
            </div>
            <span className="ml-3 text-sm font-bold text-stone-800 group-hover:text-red-600 transition-colors">
              Asosiy (standart) variant qilib belgilash
            </span>
          </label>

          {/* AMALLAR (BUTTONS) */}
          <div className="flex gap-2 pt-4 border-t border-stone-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-stone-100 hover:bg-stone-200/70 text-stone-700 font-bold text-sm rounded-xl transition-all cursor-pointer active:scale-[0.98]"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-[0.98] flex items-center justify-center"
            >
              {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};