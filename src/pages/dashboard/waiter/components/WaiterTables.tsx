import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { tableService } from "../../manager/Components/Tables/service"; 
import { orderApi } from "../../manager/Components/orderj/orderApi";
import { useAuthStore } from "../../../../modules/auth/authStore";

interface OccupiedBy {
  id: string;
  fullName: string;
}

interface Table {
  id: string;
  number: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "DISABLED";
  occupiedBy?: OccupiedBy | null;
  capacity?: number;
}

export default function WaiterTables() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [meta, setMeta] = useState<{ totalPages: number; total: number }>({ 
    totalPages: 1, 
    total: 0 
  });

  const fetchTables = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: unknown = await tableService.getAll(currentPage, 8, statusFilter);

      if (Array.isArray(data)) {
        const tablesData = data as Table[];
        setTables(tablesData);
        setMeta({ totalPages: 1, total: tablesData.length });
      } else if (data && typeof data === "object") {
        const response = data as { items: Table[]; meta: { totalPages: number; total: number } };
        const items = response.items || [];
        
        setTables(items);
        setMeta({
          totalPages: response.meta?.totalPages || 1,
          total: response.meta?.total || items.length
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Stollarni yuklashda xatolik.");
      } else {
        setError("Noma'lum xatolik yuz berdi.");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // ✅ Stol band qilish
// handleOccupyTable funksiyasini yangilang

const handleOccupyTable = async (tableId: string, e: React.MouseEvent) => {
  e.stopPropagation();
  try {
    // ✅ Eski localStorage ma'lumotlarini tozalash
    localStorage.removeItem(`waiter_cart_${tableId}`);
    localStorage.removeItem(`waiter_order_${tableId}`);
    
    const order = await orderApi.create({ tableId });
    localStorage.setItem(`waiter_order_${tableId}`, order.id);
    navigate(`/waiter/order/${tableId}/${order.id}`);
  } catch (err: unknown) {
    if (err instanceof Error && 'response' in err) {
      const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
      
      if (axiosError.response?.status === 409) {
        const savedOrderId = localStorage.getItem(`waiter_order_${tableId}`);
        
        if (savedOrderId) {
          navigate(`/waiter/order/${tableId}/${savedOrderId}`);
        } else {
          alert("Stol band. Sahifani yangilang.");
        }
      } else {
        const message = axiosError.response?.data?.message || "Stolni band qilib bo'lmadi.";
        alert(message);
      }
    } else {
      alert("Stolni band qilib bo'lmadi.");
    }
  }
};

  // ✅ Band stolga kirish (faqat o'zi band qilgan)
  const handleOpenOrder = (table: Table, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // ✅ User ID va occupiedBy ID ni tekshirish
    if (user?.id && table.occupiedBy?.id === user.id) {
      const orderId = localStorage.getItem(`waiter_order_${table.id}`);
      
      if (orderId) {
        navigate(`/waiter/order/${table.id}/${orderId}`);
      } else {
        // Agar localStorage da yo'q bo'lsa, xato
        alert("Buyurtma ma'lumotlari topilmadi. Iltimos sahifani yangilang.");
      }
    } else {
      alert("Bu stol boshqa ofitsiant tomonidan band qilingan!");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-red-50/20 min-h-screen">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-950">Zal stollari</h1>
          <p className="text-sm text-gray-500">
            Ofitsiant:{" "}
            <span className="font-semibold text-red-600">
              {user?.fullName || user?.username || "Tizim a'zosi"}
            </span>
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full appearance-none pl-3.5 pr-10 py-2.5 border border-gray-200 rounded-xl bg-white shadow-sm font-medium text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 hover:border-gray-300 transition-colors cursor-pointer"
          >
            <option value="">Barcha stollar</option>
            <option value="AVAILABLE">Bo'sh stollar</option>
            <option value="OCCUPIED">Band stollar</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 border-l border-gray-100 my-2 pl-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200 animate-fade-in">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      ) : tables.length === 0 ? (
        <div className="text-center py-14 text-gray-500 border border-dashed border-gray-300 rounded-xl bg-white">
          Tanlangan filtr bo'yicha stollar topilmadi.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {tables.map((table) => {
            const isOccupiedByMe = user?.id && table.occupiedBy?.id === user.id;
            
            return (
              <div
                key={table.id}
                onClick={(e) => {
                  // ✅ Faqat o'zi band qilgan stolga kirish
                  if (table.status === "OCCUPIED" && isOccupiedByMe) {
                    handleOpenOrder(table, e);
                  }
                }}
                className={`p-4 bg-white border rounded-2xl shadow-sm flex flex-col justify-between w-full transition-all duration-200 ${
                  table.status === "OCCUPIED" && isOccupiedByMe
                    ? "border-green-200 bg-green-50/5 ring-1 ring-green-500/10 cursor-pointer hover:shadow-md hover:-translate-y-0.5"
                    : table.status === "OCCUPIED"
                    ? "border-red-200 bg-red-50/5 ring-1 ring-red-500/10"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      table.status === "OCCUPIED" 
                        ? isOccupiedByMe 
                          ? "bg-green-200 text-green-700" 
                          : "bg-red-200 text-red-700"
                        : "bg-red-50 text-red-600"
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-base">
                          Stol {table.number}
                        </h3>
                        <span className={`text-[10px] px-1.5 py-0.5 font-bold rounded-md ${
                          table.status === "AVAILABLE" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}>
                          {table.status === "AVAILABLE" ? "Bo'sh" : "Band"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-medium mt-0.5 truncate max-w-[180px]">
                        {table.status === "AVAILABLE" && "Hali buyurtma yo'q"}
                        {table.status === "OCCUPIED" && isOccupiedByMe && "✅ Sizning stolingiz (bosing)"}
                        {table.status === "OCCUPIED" && !isOccupiedByMe && `Band: ${table.occupiedBy?.fullName || "Ofitsiant"}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>

                {/* ✅ Tugmalar qismi - Faqat bo'sh stolda "Band qilish" */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                  {table.status === "AVAILABLE" ? (
                    <button
                      onClick={(e) => handleOccupyTable(table.id, e)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl transition shadow-sm"
                    >
                      Band qilish
                    </button>
                  ) : table.status === "OCCUPIED" && isOccupiedByMe ? (
                    // ✅ O'zi band qilgan stol - tugma yo'q, faqat matn
                    <span className="text-xs text-green-600 font-semibold">
                      Faol buyurtma
                    </span>
                  ) : table.status === "OCCUPIED" ? (
                    // ✅ Boshqa ofitsiant band qilgan
                    <span className="text-xs text-red-500 font-medium italic">
                      Boshqa ofitsiant
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 italic">
                      Xizmat ko'rsatib bo'lmaydi
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1.5 border rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Orqaga
          </button>
          <span className="text-sm font-medium text-gray-600">
            Sahifa {currentPage} / {meta.totalPages}
          </span>
          <button
            disabled={currentPage >= meta.totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1.5 border rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Oldinga
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.25s ease-out forwards; }
      `}</style>
    </div>
  );
}