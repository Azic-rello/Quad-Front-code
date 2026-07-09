// src/pages/dashboard/manager/Components/orderj/OrderDetails.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrderStore } from "./orderStore";
import { OrderStatusEnum } from "./orderTypes";
import { useAuthStore } from "@/modules/auth/authStore"; // Auth store manzili

export const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const {
    currentOrder,
    fetchOrderById,
    addItemToOrder,
    updateOrderStatus,
    isLoading,
    error,
  } = useOrderStore();

  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (id) {
      fetchOrderById(id);
    }
  }, [id]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !variantId) return;

    try {
      await addItemToOrder(id, { variantId, quantity });
      setVariantId("");
      setQuantity(1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (status: OrderStatusEnum) => {
    if (!id) return;
    if (window.confirm(`Buyurtmani ${status} holatiga o'tkazmoqchimisiz?`)) {
      try {
        await updateOrderStatus(id, { status });
        if (
          status === OrderStatusEnum.PAID ||
          status === OrderStatusEnum.CANCELLED
        ) {
          navigate("/orders");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (isLoading && !currentOrder)
    return <div className="p-4 text-center">Yuklanmoqda...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!currentOrder) return <div className="p-4">Buyurtma topilmadi</div>;

  const canManage =
    user?.role === "ADMIN" ||
    user?.role === "MANAGER" ||
    (user?.role === "WAITER" && currentOrder.waiterId === user.id);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => navigate("/orders")}
          className="text-indigo-600 hover:underline"
        >
          &larr; Ortga qaytish
        </button>
        <h1 className="text-2xl font-bold">
          Buyurtma #{currentOrder.id.slice(0, 8)}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Items */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between mb-4 border-b pb-4">
              <div>
                <p className="text-sm text-gray-500">Stol</p>
                <p className="text-xl font-semibold">
                  #{currentOrder.table.number}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ofitsiant</p>
                <p className="text-lg">{currentOrder.waiter.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`px-2 py-1 rounded text-sm font-bold ${
                    currentOrder.status === OrderStatusEnum.OPEN
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {currentOrder.status}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-3">Tarkibi</h3>
            {currentOrder.items.length === 0 ? (
              <p className="text-gray-500 italic">Hali mahsulot qo'shilmagan</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {currentOrder.items.map((item) => (
                  <li
                    key={item.id}
                    className="py-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.variant.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.variant.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {item.quantity} x{" "}
                        {Number(item.unitPrice).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-900 font-bold">
                        {Number(item.totalPrice).toLocaleString()} so'm
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {currentOrder.status === OrderStatusEnum.OPEN && canManage && (
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-indigo-500">
              <h3 className="text-lg font-medium mb-4">Mahsulot Qo'shish</h3>
              <form onSubmit={handleAddItem} className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Variant ID
                  </label>
                  <input
                    type="text"
                    value={variantId}
                    onChange={(e) => setVariantId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    placeholder="UUID yoki SKU"
                    required
                  />
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700">
                    Miqdor
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Qo'shish
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Totals & Actions */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Hisob-kitob</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>
                  {Number(currentOrder.subtotal).toLocaleString()} so'm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Xizmat haqi:</span>
                <span>
                  {Number(currentOrder.serviceFee).toLocaleString()} so'm
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
                <span>Jami:</span>
                <span>{Number(currentOrder.total).toLocaleString()} so'm</span>
              </div>
            </div>
          </div>

          {canManage && currentOrder.status === OrderStatusEnum.OPEN && (
            <div className="bg-white p-6 rounded-lg shadow space-y-3">
              <h3 className="text-lg font-medium mb-2">Harakatlar</h3>
              <button
                onClick={() => handleStatusChange(OrderStatusEnum.PAID)}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                To'landi
              </button>
              <button
                onClick={() => handleStatusChange(OrderStatusEnum.CANCELLED)}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Bekor qilish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
