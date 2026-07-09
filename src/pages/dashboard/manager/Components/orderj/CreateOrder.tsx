// src/pages/dashboard/manager/Components/orderj/CreateOrder.tsx

import React, { useState } from "react";
import { useOrderStore } from "./orderStore";
import { useNavigate } from "react-router-dom";

export const CreateOrder = () => {
  const navigate = useNavigate();
  const { createOrder, isLoading, error } = useOrderStore();
  const [tableId, setTableId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableId) return;

    try {
      const newOrder = await createOrder({ tableId });
      navigate(`/orders/${newOrder.id}`);
    } catch (err) {
      // Xatolik store da allaqachon o'rnatilgan
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Yangi Buyurtma Ochish
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="tableId"
            className="block text-sm font-medium text-gray-700"
          >
            Stol ID (UUID)
          </label>
          <input
            type="text"
            id="tableId"
            value={tableId}
            onChange={(e) => setTableId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            placeholder="Masalan: 123e4567-e89b-12d3-a456-426614174000"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Eslatma: Haqiqiy loyihada bu yerda Stollar ro'yxatidan tanlash
            dropdown bo'lishi kerak.
          </p>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? "Yaratilmoqda..." : "Buyurtma Ochish"}
          </button>
        </div>
      </form>
    </div>
  );
};
