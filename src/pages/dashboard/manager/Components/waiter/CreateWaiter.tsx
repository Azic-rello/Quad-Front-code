import React, { useState } from "react";
import axios from "axios";
import { UserPlus, Loader2, AlertCircle } from "lucide-react";
import { waiterService, type BackendErrorResponse } from "./service";

interface CreateWaiterFormProps {
  onSuccess: () => void;
}

export const CreateWaiterForm: React.FC<CreateWaiterFormProps> = ({ onSuccess }) => {
  const [fullName, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!fullName || !username || !password) {
      setError("Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await waiterService.createWaiter({
          fullName,
          username,
          password,
      });

      // Formani tozalash
      setFullName("");
      setUsername("");
      setPassword("");
      
      // Muallifni xabardor qilish
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError<BackendErrorResponse>(err) && err.response) {
        const backendMessage = err.response.data.message;
        if (Array.isArray(backendMessage)) {
          setError(backendMessage.join(", "));
        } else {
          setError(backendMessage || "Ofitsiant qo'shishda xatolik yuz berdi.");
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
          Yangi Ofitsiant Qo{"'"}shish
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Kafega yangi waiter xodimini tizimda ro{"'"}yxatdan o{"'"}tkazish.
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
            Parol
          </label>
          <input
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isSubmitting}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#e31221] focus:ring-4 focus:ring-[#e31221]/5 disabled:opacity-60 transition-all"
          />
        </div>

        {/* ================= Tasdiqlash tugmasi ================= */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#e31221] hover:bg-[#c40f1c] text-white py-3 rounded-xl text-sm font-semibold shadow-md shadow-red-600/10 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Kutilmoqda...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Ofitsiantni Qo{"'"}shish</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};