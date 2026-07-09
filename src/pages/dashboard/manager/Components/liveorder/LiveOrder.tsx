import React, { useState, useEffect, useCallback } from "react";
import { Grid, DollarSign, XCircle, RefreshCw } from "lucide-react";
import { $api } from "@/services/api";
import { orderApi } from "../orderj/orderApi";
import type { Order, OrdersResponse } from "../orderj/orderTypes";
import { OrderStatusEnum } from "../orderj/orderTypes";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onConfirm: (tipPercent: number) => Promise<void>;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, order, onConfirm }) => {
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = order ? Number(order.total) || 0 : 0;
  const tipAmount = Math.round((totalAmount * tipPercent) / 100);
  const finalAmount = totalAmount + tipAmount;

  if (!isOpen || !order) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(tipPercent);
      // ✅ Muvaffaqiyatli bo'lgandan keyin modalni yopish
      onClose();
    } catch (error) {
      console.error("To'lov xatosi:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <h3 className="font-bold text-xl text-gray-800">To'lovni qabul qilish</h3>
          <p className="text-sm text-gray-500 mt-1">
            Stol #{order.table.number} - {order.waiter.fullName}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="text-sm text-gray-600">Buyurtma summasi:</span>
            <span className="font-bold text-gray-900">{totalAmount.toLocaleString()} so'm</span>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Ish foizi (Waiter uchun)
            </label>
            
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={tipPercent}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 0 && val <= 100) {
                    setTipPercent(val);
                  }
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Foizni kiriting (0-100)"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="text-sm text-blue-800">
                 Waiterga: <strong>{tipAmount.toLocaleString()} so'm</strong> ({tipPercent}%)
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center p-4 bg-red-50 border border-red-200 rounded-xl">
            <span className="text-lg font-bold text-gray-900">Jami to'lov:</span>
            <span className="text-2xl font-black text-red-600">
              {finalAmount.toLocaleString()} so'm
            </span>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <DollarSign className="w-5 h-5" />
            )}
            {isSubmitting ? 'Qabul qilinmoqda...' : "To'landi"}
          </button>
        </div>
      </div>
    </div>
  );
};

const LiveOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const fetchLiveOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await $api.get<OrdersResponse>('/orders', {
        params: { limit: 1000 }
      });
      
      const openOrders = data.items.filter(
        (order: Order) => order.status === OrderStatusEnum.OPEN
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

  const handleCloseBill = async (orderId: string, tableNumber: number, tipPercent: number) => {
    // ✅ Backendga PAID statusini yuborish
    await orderApi.updateStatus(orderId, { status: OrderStatusEnum.PAID });
    
    // ✅ Alert ko'rsatish
    alert(`Table ${tableNumber} to'lovi qabul qilindi!\nIsh foizi: ${tipPercent}%`);
    
    // ✅ Ro'yxatni yangilash
    await fetchLiveOrders();
  };

  const handleCancelOrder = async (orderId: string, tableNumber: number) => {
    if (window.confirm(`Table ${tableNumber} buyurtmasini bekor qilmoqchimisiz?`)) {
      try {
        await orderApi.updateStatus(orderId, { status: OrderStatusEnum.CANCELLED });
        alert(`Table ${tableNumber} buyurtmasi bekor qilindi.`);
        fetchLiveOrders();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Bekor qilishda xatolik.";
        alert(message);
      }
    }
  };

  const handlePaymentClick = (order: Order) => {
    setSelectedOrder(order);
    setIsPaymentModalOpen(true);
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
              <div key={i} className="bg-white rounded-[24px] border border-stone-200/60 h-56 animate-pulse" />
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
              const totalAmount = Number(order.total) || 0;
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
                            <div key={item.id} className="flex justify-between items-center border-b border-stone-50 pb-1.5">
                              <span className="text-stone-600 font-medium">
                                {item.variant.product.name} × {item.quantity}
                              </span>
                              <span className="text-stone-900">
                                {(Number(item.unitPrice) * item.quantity).toLocaleString()} so'm
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
                        onClick={() => handlePaymentClick(order)}
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

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onConfirm={async (tipPercent) => {
          if (selectedOrder) {
            await handleCloseBill(selectedOrder.id, selectedOrder.table.number, tipPercent);
          }
        }}
      />
    </div>
  );
};

export default LiveOrder;