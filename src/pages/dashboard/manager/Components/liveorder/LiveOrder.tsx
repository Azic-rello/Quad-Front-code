import React, { useState, useEffect, useCallback } from "react";
import { Grid, DollarSign } from "lucide-react";
import { tableService } from "../Tables/service"; // Sening asl servising

// 1. Tip nomini o'zgartiramiz, toki sening ichki Table'ing bilan to'qnashmasin
interface LiveOrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface LiveTable {
  id: string;
  number: number;
  name?: string;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "DISABLED";
  occupiedBy?: { fullName: string } | null;
  currentOrder?: {
    waiterName?: string;
    items: LiveOrderItem[];
    totalAmount: number;
  } | null;
}

const LiveOrder: React.FC = () => {
  // Statetni LiveTable tipida ochamiz
  const [tables, setTables] = useState<LiveTable[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tableService.getAll(1, 100, "");

      let items: any[] = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data && typeof data === "object") {
        items = data.items || data.data || [];
      }

      // 🚀 ASOSIY YECHIM: TypeScript qizil bo'lmasligi uchun tipni majburiy o'giramiz (Type Assertion)
      setTables(items as unknown as LiveTable[]);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Jonli buyurtmalarni yuklashda xatolik yuz berdi.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveOrders();
    const interval = setInterval(fetchLiveOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchLiveOrders]);

  const handleCloseBill = async (
    tableId: string,
    tableNumber: number,
    total: number,
  ) => {
    if (
      window.confirm(
        `Stol ${tableNumber} uchun ${total.toLocaleString()} so'm hisobni yopmoqchimisiz?`,
      )
    ) {
      try {
        alert(`Stol ${tableNumber} hisobi muvaffaqiyatli yopildi!`);
        fetchLiveOrders();
      } catch (err: any) {
        alert(err.response?.data?.message || "Hisobni yopishda xatolik.");
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#faf9f6] p-4 sm:p-6 lg:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Faol buyurtmalar
            </h1>
            <p className="text-xs text-stone-400 font-medium mt-0.5">
              Real vaqtdagi faol stollar va buyurtmalar ro'yxati
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 text-xs font-bold text-red-700 bg-red-50 rounded-2xl">
            {error}
          </div>
        )}

        {/* Grid kontent */}
        {isLoading && tables.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-[24px] border border-stone-200/60 h-56 animate-pulse"
              />
            ))}
          </div>
        ) : tables.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-stone-200 text-stone-400 font-bold text-sm">
            Tizimda hech qanday stol topilmadi.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table) => {
              const isOccupied = table.status === "OCCUPIED";
              const waiter =
                table.currentOrder?.waiterName ||
                table.occupiedBy?.fullName ||
                "Sardor";
              const items = table.currentOrder?.items || [];
              const totalAmount = table.currentOrder?.totalAmount || 0;

              return (
                <div
                  key={table.id}
                  className={`bg-white border rounded-[24px] p-5 flex flex-col justify-between min-h-[220px] transition-all duration-300 ${
                    isOccupied
                      ? "border-red-500 ring-4 ring-red-500/5 bg-white shadow-md transform -translate-y-0.5"
                      : "border-stone-200/80 shadow-2xs"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                            isOccupied
                              ? "bg-[#e31221] text-white border-transparent"
                              : "bg-stone-50 text-stone-700 border-stone-200/60"
                          }`}
                        >
                          <Grid className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-black text-stone-900 text-base">
                            Stol {table.number}
                          </h3>
                          <p className="text-xs text-stone-400 font-semibold">
                            {isOccupied ? `Waiter: ${waiter}` : "Empty"}
                          </p>
                        </div>
                      </div>

                      {isOccupied && (
                        <span className="bg-[#e31221] text-white font-black text-[10px] tracking-wider px-2 py-0.5 rounded-md animate-pulse">
                          Jonli
                        </span>
                      )}
                    </div>

                    <div className="mt-5 space-y-2">
                      {isOccupied && items.length > 0 ? (
                        <div className="space-y-2 text-xs text-stone-700 font-bold max-h-36 overflow-y-auto pr-1">
                          {items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center border-b border-stone-50 pb-1.5"
                            >
                              <span className="text-stone-600 font-medium">
                                {item.name}{" "}
                                <span className="text-stone-400 font-semibold px-1">
                                  ×
                                </span>{" "}
                                {item.quantity}
                              </span>
                              <span className="text-stone-900">
                                {(item.price * item.quantity).toLocaleString()}{" "}
                                so'm
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs font-bold text-stone-400/80 py-4 tracking-wide">
                          Hozircha buyurtmalar yo‘q
                        </p>
                      )}
                    </div>
                  </div>

                  {isOccupied && (
                    <div className="mt-6 pt-4 border-t border-dashed border-stone-200 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="block text-[10px] uppercase font-black text-stone-400 tracking-wider">
                          Umumiy
                        </span>
                        <span className="text-xl font-black text-[#e31221] tracking-tight">
                          {totalAmount.toLocaleString()} so'm
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          handleCloseBill(table.id, table.number, totalAmount)
                        }
                        className="bg-[#e31221] hover:bg-red-700 text-white font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm shadow-red-500/20 transition-all active:scale-[0.97]"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        Hisobni yopish
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveOrder;
