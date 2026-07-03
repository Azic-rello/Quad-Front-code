import React from "react";
import { Users, Calendar, Loader2, Pencil, Trash2 } from "lucide-react";
import { type UserResponseDto } from "./service";

interface WaitersListProps {
  waiters: UserResponseDto[];
  isLoading: boolean;
  isActionLoading: string | null;
  onEdit: (user: UserResponseDto) => void;
  onDelete: (id: string) => Promise<void>;
}

export const WaitersList: React.FC<WaitersListProps> = ({
  waiters,
  isLoading,
  isActionLoading,
  onEdit,
  onDelete,
}) => {
  // 1. Umumiy ma'lumot yuklanayotgan holat (Skeleton o'rnida spinner)
  if (isLoading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-stone-500 space-y-2">
        <Loader2 className="w-8 h-8 animate-spin text-[#e31221]" />
        <span className="text-xs font-medium">Bazadan ma{"'"}lumotlar yuklanmoqda...</span>
      </div>
    );
  }

  // 2. Bazada umuman waiter bo'lmagan holat
  if (waiters.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col justify-center items-center">
        <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-xl mb-3">
          👥
        </div>
        <h3 className="text-base font-bold text-stone-800">Ofitsiantlar topilmadi</h3>
        <p className="text-xs text-stone-400 max-w-sm mt-1">
          Bazada hozircha hech qanday waiter xodim mavjud emas.
        </p>
      </div>
    );
  }

  // 3. To'liq ma'lumotlar jadvali
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-wider select-none">
            <th className="px-6 py-4">Ism va Familiya</th>
            <th className="px-6 py-4">Username</th>
            <th className="px-6 py-4">Rol</th>
            <th className="px-6 py-4">Qo{"'"}shilgan Sana</th>
            <th className="px-6 py-4 text-right">Amallar</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 text-sm">
          {waiters.map((waiter) => (
            <tr key={waiter.id} className="hover:bg-stone-50/60 transition-colors duration-150">
              {/* Ism va Familiya */}
              <td className="px-6 py-4 font-medium text-stone-900 flex items-center space-x-3">
                <div className="w-8 h-8 bg-stone-100 text-stone-600 rounded-full flex items-center justify-center font-bold text-xs uppercase select-none">
                  {waiter.fullName ? waiter.fullName.charAt(0) : "W"}
                </div>
                <span>{waiter.fullName}</span>
              </td>

              {/* Username */}
              <td className="px-6 py-4 text-stone-500 font-mono text-xs">
                @{waiter.username}
              </td>

              {/* Rol nishoni */}
              <td className="px-6 py-4">
                <span className="inline-flex items-center space-x-1 bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full text-xs font-medium">
                  <Users className="w-3 h-3" />
                  <span>{waiter.role}</span>
                </span>
              </td>

              {/* Qo'shilgan sana */}
              <td className="px-6 py-4 text-stone-500 text-xs">
                <div className="flex items-center space-x-1.5 py-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>
                    {waiter.createdAt ? new Date(waiter.createdAt).toLocaleDateString("uz-UZ") : "Noma'lum"}
                  </span>
                </div>
              </td>

              {/* ⚡️ AMALLAR TUGMALARI PANELi */}
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <div className="inline-flex items-center space-x-1">
                  {/* Tahrirlash tugmasi */}
                  <button
                    onClick={() => onEdit(waiter)}
                    disabled={isActionLoading !== null}
                    className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none"
                    title="Tahrirlash"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  {/* O'chirish tugmasi */}
                  <button
                    onClick={async () => {
                      if (window.confirm(`${waiter.fullName} xodimini tizimdan o'chirishni tasdiqlaysizmi?`)) {
                        await onDelete(waiter.id);
                      }
                    }}
                    disabled={isActionLoading !== null}
                    className="p-2 text-stone-400 hover:text-[#e31221] hover:bg-red-50 rounded-xl transition-all duration-150 flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none"
                    title="O'chirish"
                  >
                    {isActionLoading === waiter.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#e31221]" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};