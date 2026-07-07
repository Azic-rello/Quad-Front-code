import React, { useState, useEffect } from "react";
import axios from "axios";
import { Save, Loader2, AlertCircle } from "lucide-react";
import { waiterService, type UserResponseDto } from "./service";

interface EditWaiterFormProps {
  waiter: UserResponseDto;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EditWaiterForm: React.FC<EditWaiterFormProps> = ({
  waiter,
  onSuccess,
  onCancel,
}) => {
  const [fullName, setFullName] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Oyna ochilganda eski ma'lumotlarni formaga yuklash
  useEffect(() => {
    if (waiter) {
      setFullName(waiter.fullName || "");
    }
  }, [waiter]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      const updateData = {
        fullName: fullName.trim(),
      };

      console.log("Waiter:", waiter);
      console.log("ID:", waiter.id);
      console.log("DATA:", updateData);

      const res = await waiterService.updateWaiter(waiter.id, updateData);

      console.log("SUCCESS:", res);

      onSuccess();
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        console.log(err.response?.status);
        console.log(err.response?.data);

        setError(
          err.response?.data?.message ?? "Yangilashda xatolik yuz berdi.",
        );
      } else {
        setError("Noma'lum xatolik.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-7 text-stone-800">
      {/* ================= Header ================= */}
      <div className="mb-6">
        <h3 className="text-xl font-bold tracking-tight text-stone-900">
          Ofitsiant Ma{"'"}lumotlarini Tahrirlash
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Xodim profilidagi oʻzgarishlarni kiriting va saqlang.
        </p>
      </div>

      {/* ================= Xatolik oynasi ================= */}
      {error && (
        <div className="mb-5 flex items-start space-x-2 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* ================= Forma ================= */}
      <form onSubmit={handleSubmit} className="space-y-4.5">
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Ism va Familiya
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFullName(e.target.value)
            }
            placeholder="Masalan: Ali Valiyev"
            disabled={isSubmitting}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#e31221] focus:ring-4 focus:ring-[#e31221]/5 disabled:opacity-60 transition-all"
          />
        </div>

        {/* ================= Amallar paneli ================= */}
        <div className="flex items-center space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 py-3 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-95 disabled:opacity-50"
          >
            Bekor qilish
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-2/3 bg-[#e31221] hover:bg-[#c40f1c] text-white py-3 rounded-xl text-sm font-semibold shadow-md shadow-red-600/10 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saqlanmoqda...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Oʻzgarishlarni Saqlash</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
