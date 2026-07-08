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
  // 1. Umumiy ma'lumot yuklanayotgan holat + Silliq animatsiya
  if (isLoading) {
    return (
      <div className="p-24 flex flex-col items-center justify-center text-stone-500 space-y-4 bg-white rounded-[32px] shadow-xs animate-in fade-in duration-300">
        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
        <span className="text-sm font-semibold text-stone-400 tracking-wide">
          Loading waiters data...
        </span>
      </div>
    );
  }

  // 2. Bazada umuman waiter bo'lmagan holat + Silliq animatsiya
  if (waiters.length === 0) {
    return (
      <div className="p-24 text-center flex flex-col justify-center items-center bg-white rounded-[32px] shadow-xs select-none animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-stone-50 border border-stone-100 rounded-3xl flex items-center justify-center text-4xl mb-5 shadow-sm">
          👥
        </div>
        <h3 className="text-lg font-bold text-stone-900 tracking-tight">
          No waiters found
        </h3>
        <p className="text-sm text-stone-400 mt-2 font-medium">
          Add a new waiter to get started.
        </p>
      </div>
    );
  }

  // 3. To'liq ma'lumotlar jadvali (Yiriklashtirilgan, Responsive va Animatsiyali)
  return (
    <div className="w-full overflow-x-auto bg-white rounded-[32px] border border-stone-100/80 p-3 shadow-xs animate-in fade-in slide-in-from-bottom-4 duration-300">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="bg-white border-b border-stone-100 text-stone-400 text-sm font-bold tracking-wider select-none">
            <th className="px-8 py-5 font-semibold uppercase">Name</th>
            <th className="px-8 py-5 font-semibold uppercase">
              Username / Email
            </th>
            <th className="px-8 py-5 text-right font-semibold uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-base text-stone-900">
          {waiters.map((waiter) => {
            const displayName = waiter.fullName || waiter.username;
            const firstLetter = displayName.charAt(0).toUpperCase();

            return (
              <tr
                key={waiter.id}
                className="border-b last:border-0 border-stone-100/70 hover:bg-stone-50/80 transition-colors duration-200"
              >
                {/* Ism va Familiya */}
                <td className="px-8 py-5 font-medium text-stone-950 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    {/* Yiriklashtirilgan Avatar */}
                    <div className="w-12 h-12 bg-stone-100 border border-stone-200/60 rounded-2xl flex items-center justify-center text-stone-700 font-black text-lg shadow-sm select-none">
                      {firstLetter}
                    </div>
                    <span className="font-bold text-lg tracking-tight">
                      {displayName}
                    </span>
                  </div>
                </td>

                {/* Username / Email joyi */}
                <td className="px-8 py-5 text-stone-500 font-semibold text-base whitespace-nowrap">
                  {waiter.username}
                </td>

                {/* AMALLAR TUGMALARI PANELi (Interaktiv effektlar bilan) */}
                <td className="px-8 py-5 text-right whitespace-nowrap">
                  <div className="inline-flex items-center space-x-3">
                    {/* Tahrirlash tugmasi */}
                    <button
                      onClick={() => onEdit(waiter)}
                      disabled={isActionLoading !== null}
                      className="p-3 text-stone-600 bg-white border-2 border-stone-100 hover:bg-stone-100 hover:text-stone-900 hover:border-stone-200 active:scale-95 rounded-2xl transition-all duration-150 disabled:opacity-40 shadow-sm cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>

                    {/* O'chirish tugmasi */}
                    <button
                      onClick={async () => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete ${displayName}?`,
                          )
                        ) {
                          await onDelete(waiter.id);
                        }
                      }}
                      disabled={isActionLoading !== null}
                      className="p-3 text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-2xl transition-all duration-150 flex items-center justify-center disabled:opacity-40 shadow-md shadow-red-900/20 cursor-pointer"
                      title="Delete"
                    >
                      {isActionLoading === waiter.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
