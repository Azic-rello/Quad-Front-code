import React, { useState, useEffect } from "react";
import axios from "axios";
import { Save, Loader2, AlertCircle } from "lucide-react";
import { waiterService, type UserResponseDto, type BackendErrorResponse } from "./service";

interface EditWaiterFormProps {
  waiter: UserResponseDto;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EditWaiterForm: React.FC<EditWaiterFormProps> = ({ waiter, onSuccess, onCancel }) => {
  const [fullName, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>(""); // Parolni yangilash ixtiyoriy

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Oyna ochilganda eski ma'lumotlarni formaga yuklash
  useEffect(() => {
    if (waiter) {
      setFullName(waiter.fullName || "");
      setUsername(waiter.username || "");
      setPassword(""); // Parol xavfsizlik uchun yashirin turadi
    }
  }, [waiter]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!fullName || !username) {
      setError("Ism va Username maydonlari to'ldirilishi shart.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Backend update API'siga yuboriladigan toza obyekt
      const updateData: { fullName: string; username: string; password?: string } = {
        fullName,
        username,
      };

      // Agar muallif yangi parol yozgan bo'lsa, uni ham qo'shib yuboramiz
      if (password.trim().length > 0) {
        updateData.password = password;
      }

      // Servis orqali yangilash so'rovi (ID bilan birga)
      await waiterService.updateWaiter(waiter.id, updateData);

      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError<BackendErrorResponse>(err) && err.response) {
        const backendMessage = err.response.data.message;
        if (Array.isArray(backendMessage)) {
          setError(backendMessage.join(", "));
        } else {
          setError(backendMessage || "Ma'lumotlarni yangilashda xatolik yuz berdi.");
        }
      } else {
        setError("Tarmoq xatoligi yuz berdi. Qayta urinib ko'ring.");
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
            placeholder="Masalan: Ali Valiyev"
            disabled={isSubmitting}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#e31221] focus:ring-4 focus:ring-[#e31221]/5 disabled:opacity-60 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Username
          </label>
          <div className="relative">
            <span className="absolute left-4 top-2.5 text-stone-400 text-sm select-none">@</span>
            <input
              type="text"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              placeholder="ali_waiter"
              disabled={isSubmitting}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#e31221] focus:ring-4 focus:ring-[#e31221]/5 disabled:opacity-60 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Yangi Parol <span className="text-stone-400 font-normal lowercase">(ixtiyoriy)</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="O'zgarishsiz qoldirish uchun bo'sh qo'ying"
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