import React from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
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
  // 1. Umumiy ma'lumot yuklanayotgan holat
  if (isLoading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-stone-500 space-y-2 bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        <span className="text-xs font-medium text-stone-400">
          Loading data...
        </span>
      </div>
    );
  }

  // 2. Bazada umuman waiter bo'lmagan holat
  if (waiters.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col justify-center items-center bg-white">
        <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center text-xl mb-3">
          👥
        </div>
        <h3 className="text-sm font-semibold text-stone-800">
          No waiters found
        </h3>
      </div>
    );
  }

  // 3. To'liq ma'lumotlar jadvali (image_d1cdea.png rasmidagi dizayn asosida)
  return (
    <div className="overflow-x-auto bg-white p-4">
      <table className="w-full text-left border-collapse">
        <thead>
          {/* Rasmda jadval tepasi oq fonda va matn rangi och kulrang */}
          <tr className="bg-white border-b border-stone-100 text-stone-400 text-sm font-normal select-none">
            <th className="px-6 py-4 font-normal">Name</th>
            <th className="px-6 py-4 font-normal">Email</th>
            <th className="px-6 py-4 font-normal">Password</th>
            <th className="px-6 py-4 text-right font-normal">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm text-stone-900">
          {waiters.map((waiter) => (
            <tr key={waiter.id} className="transition-colors duration-150">
              {/* Ism va Familiya */}
              <td className="px-6 py-5 font-medium text-stone-900">
                {waiter.fullName || waiter.username}
              </td>

              {/* Username / Email joyi */}
              <td className="px-6 py-5 text-stone-800">
                {waiter.username.includes("@")
                  ? waiter.username
                  : `${waiter.username}`}
              </td>

              {/* Parol qismi (Rasmdagi kabi kichik kulrang badge ichida) */}
              <td className="px-6 py-5">
                <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md text-xs font-mono">
                  123
                </span>
              </td>

              {/* ⚡️ AMALLAR TUGMALARI PANELi (Aynan rasmdagidek) */}
              <td className="px-6 py-5 text-right whitespace-nowrap">
                <div className="inline-flex items-center space-x-2">
                  {/* Tahrirlash tugmasi - Oq fon, kulrang aylanma chiziq */}
                  <button
                    onClick={() => onEdit(waiter)}
                    disabled={isActionLoading !== null}
                    className="p-2 text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl transition-all duration-150 disabled:opacity-40 shadow-sm"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  {/* O'chirish tugmasi - To'liq yorqin qizil fon, oq ikonka */}
                  <button
                    onClick={async () => {
                      if (
                        window.confirm(
                          `Delete ${waiter.fullName || waiter.username}?`,
                        )
                      ) {
                        await onDelete(waiter.id);
                      }
                    }}
                    disabled={isActionLoading !== null}
                    className="p-2 text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all duration-150 flex items-center justify-center disabled:opacity-40 shadow-sm shadow-red-900/10"
                    title="Delete"
                  >
                    {isActionLoading === waiter.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
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
