import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, X, AlertCircle } from "lucide-react";

import {
  waiterService,
  type UserResponseDto,
  type BackendErrorResponse,
} from "./service";
import { WaitersList } from "./waiterlist";
import { CreateWaiterForm } from "./CreateWaiter";
import { EditWaiterForm } from "./waiteredit";

const WaitersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingWaiter, setEditingWaiter] = useState<UserResponseDto | null>(
    null,
  ); // Tahrirlanayotgan ob'ekt statesi

  const [waiters, setWaiters] = useState<UserResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔄 1. Ma'lumotlarni serverdan yuklash
  const fetchWaiters = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await waiterService.getWaiters();

      // Faqat WAITER roldagi xodimlarni qat'iy filterlash
      const filteredWaiters = data.filter((user) => user.role === "WAITER");

      setWaiters(filteredWaiters);
    } catch (err: unknown) {
      if (axios.isAxiosError<BackendErrorResponse>(err) && err.response) {
        const backendMessage = err.response.data.message;
        if (Array.isArray(backendMessage)) {
          setError(backendMessage.join(", "));
        } else {
          setError(backendMessage || "Serverdan ma'lumot olishda xatolik.");
        }
      } else {
        setError("Tarmoq ulanishida xatolik yuz berdi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWaiters();
  }, []);

  // ✏️ 2. Tahrirlash tugmasi bosilganda ob'ektni xotiraga olish (Modal ochiladi)
  const handleEditWaiter = (user: UserResponseDto): void => {
    setEditingWaiter(user);
  };

  // 🗑 3. Xodimni o'chirish mantiqi
  const handleDeleteWaiter = async (id: string): Promise<void> => {
    try {
      setIsActionLoading(id);
      setError(null);

      await waiterService.deleteWaiter(id);
      setWaiters((prevWaiters) =>
        prevWaiters.filter((waiter) => waiter.id !== id),
      );
    } catch (err: unknown) {
      if (axios.isAxiosError<BackendErrorResponse>(err) && err.response) {
        const backendMessage = err.response.data.message;
        alert(
          Array.isArray(backendMessage)
            ? backendMessage.join(", ")
            : backendMessage,
        );
      } else {
        alert("Xodimni o'chirishda kutilmagan xatolik yuz berdi.");
      }
    } finally {
      setIsActionLoading(null);
    }
  };

  // Yangi qo'shilganda ishlaydigan callback
  const handleWaiterCreated = (): void => {
    fetchWaiters();
    setIsModalOpen(false);
  };

  // Tahrirlash muvaffaqiyatli tugaganda ishlaydigan callback
  const handleWaiterUpdated = (): void => {
    fetchWaiters();
    setEditingWaiter(null);
  };

  return (
    <div className="space-y-6 text-stone-800 relative min-h-[calc(100vh-120px)] p-6 bg-stone-50">
      {/* ================= Sarlavha va Qo'shish Tugmasi (Aralashgan) ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200/80 pb-6 mb-6 select-none">
        <h2 className="text-xl font-semibold tracking-tight text-stone-950">
          Ofitsantlar
        </h2>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-sm active:scale-95 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Qo`shish</span>
        </button>
      </div>

      {/* ================= Xatolik bildirishnomasi ================= */}
      {error && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Tizim ogohlantirishi:</p>
            <p className="text-xs opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* ================= Jadval Konteyneri (Rasmga moslashtirilgan) ================= */}
      <div className="bg-white border border-stone-100 rounded-3xl shadow-lg shadow-black/5 overflow-hidden">
        <WaitersList
          waiters={waiters}
          isLoading={isLoading}
          isActionLoading={isActionLoading}
          onEdit={handleEditWaiter}
          onDelete={handleDeleteWaiter}
        />
      </div>

      {/* ================= 1. Yangi qo'shish modali ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-stone-100 z-10 transform overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 hover:bg-stone-50 p-2 rounded-xl transition-all duration-200 z-20"
            >
              <X className="w-4 h-4" />
            </button>
            <CreateWaiterForm onSuccess={handleWaiterCreated} />
          </div>
        </div>
      )}

      {/* ================= 2. TAHRIRLASH MODALI ================= */}
      {editingWaiter !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setEditingWaiter(null)}
          />
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-stone-100 z-10 transform overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setEditingWaiter(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 hover:bg-stone-50 p-2 rounded-xl transition-all duration-200 z-20"
            >
              <X className="w-4 h-4" />
            </button>
            <EditWaiterForm
              waiter={editingWaiter}
              onSuccess={handleWaiterUpdated}
              onCancel={() => setEditingWaiter(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitersPage;
