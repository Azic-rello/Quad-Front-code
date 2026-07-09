import React, { useState, useEffect, useCallback } from "react";
import { Grid, DollarSign, XCircle, RefreshCw } from "lucide-react";
import { $api } from "@/services/api";
import { orderApi } from "../orderj/orderApi";
import type { Order, OrdersResponse } from "../orderj/orderTypes";
import { OrderStatusEnum } from "../orderj/orderTypes";

const LiveOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // ✅ Backendni o'zgartirmasdan barcha buyurtmalarni olamiz
      const { data } = await $api.get<OrdersResponse>("/orders", {
        params: { limit: 1000 },
      });

      // Frontendda faqat OPEN statusdagilarini filterlaymiz
      const openOrders = data.items.filter(
        (order: Order) => order.status === OrderStatusEnum.OPEN,
      );

      setOrders(openOrders);
    } catch (err: unknown) {
      console.error("Live orders xatosi:", err);
      let errorMessage = "Server xatosi";

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveOrders();
    const interval = setInterval(fetchLiveOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchLiveOrders]);

  const handleCloseBill = async (
    orderId: string,
    tableNumber: number,
    total: number,
  ) => {
    if (
      window.confirm(
        `Table ${tableNumber} uchun ${total.toLocaleString()} so'm hisobni yopmoqchimisiz?`,
      )
    ) {
      try {
        await orderApi.updateStatus(orderId, { status: OrderStatusEnum.PAID });
        alert(`Table ${tableNumber} hisobi muvaffaqiyatli yopildi!`);
        fetchLiveOrders();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Hisobni yopishda xatolik.";
        alert(message);
      }
    }
  };

  const handleCancelOrder = async (orderId: string, tableNumber: number) => {
    if (
      window.confirm(`Table ${tableNumber} buyurtmasini bekor qilmoqchimisiz?`)
    ) {
      try {
        await orderApi.updateStatus(orderId, {
          status: OrderStatusEnum.CANCELLED,
        });
        alert(`Table ${tableNumber} buyurtmasi bekor qilindi.`);
        fetchLiveOrders();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Bekor qilishda xatolik.";
        alert(message);
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#faf9f6] p-4 sm:p-6 lg:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Live Orders
            </h1>
            <p className="text-xs text-stone-400 font-medium mt-0.5">
              Real vaqtdagi faol buyurtmalar ro'yxati
            </p>
          </div>
          <button
            onClick={fetchLiveOrders}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-bold text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Yangilash
          </button>
        </div>

        {error && (
          <div className="p-4 text-xs font-bold text-red-700 bg-red-50 rounded-2xl border border-red-200 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={fetchLiveOrders}
              className="underline hover:text-red-900 font-bold"
            >
              Qayta urinish
            </button>
          </div>
        )}

        {isLoading && orders.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-[24px] border border-stone-200/60 h-56 animate-pulse"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-stone-200 text-stone-400 font-bold text-sm">
            Hozircha faol buyurtmalar yo'q
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => {
              const waiter = order.waiter.fullName;
              const items = order.items;
              const totalAmount = order.total;
              const tableNumber = order.table.number;
              return (
                <div
                  key={order.id}
                  className="bg-white border border-red-500 ring-4 ring-red-500/5 rounded-[24px] p-5 flex flex-col justify-between min-h-[220px] shadow-md"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#e31221] text-white">
                          <Grid className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-black text-stone-900 text-base">
                            Table {tableNumber}
                          </h3>
                          <p className="text-xs text-stone-400 font-semibold">
                            Waiter: {waiter}
                          </p>
                        </div>
                      </div>
                      <span className="bg-[#e31221] text-white font-black text-[10px] tracking-wider px-2 py-0.5 rounded-md animate-pulse">
                        LIVE
                      </span>
                    </div>

                    <div className="mt-5 space-y-2">
                      {items.length > 0 ? (
                        <div className="space-y-2 text-xs text-stone-700 font-bold max-h-36 overflow-y-auto pr-1">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center border-b border-stone-50 pb-1.5"
                            >
                              <span className="text-stone-600 font-medium">
                                {item.variant.product.name} × {item.quantity}
                              </span>
                              <span className="text-stone-900">
                                {(
                                  item.unitPrice * item.quantity
                                ).toLocaleString()}{" "}
                                so'm
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs font-bold text-stone-400/80 py-4">
                          Hali buyurtma yo'q
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-dashed border-stone-200 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="block text-[10px] uppercase font-black text-stone-400 tracking-wider">
                        Total
                      </span>
                      <span className="text-xl font-black text-[#e31221] tracking-tight">
                        {totalAmount.toLocaleString()} so'm
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCancelOrder(order.id, tableNumber)}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-black text-xs px-3 py-2.5 rounded-xl flex items-center gap-1 transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Bekor
                      </button>
                      <button
                        onClick={() =>
                          handleCloseBill(order.id, tableNumber, totalAmount)
                        }
                        className="bg-[#e31221] hover:bg-red-700 text-white font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        To'landi
                      </button>
                    </div>
                  </div>
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
