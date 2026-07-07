import { useState, useEffect, useCallback } from "react";
import { tableService, type Table } from "../../manager/Components/Tables/service"; 
import { useAuthStore } from "../../../../modules/auth/authStore"; 

export default function WaiterTables() {
  // Tizimga kirgan ofitsiant ma'lumotlari
  const user = useAuthStore((state: any) => state.user);
  
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [meta, setMeta] = useState({ totalPages: 1, total: 0 });

  // 🔄 Stollarni yuklash funksiyasi
  const fetchTables = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tableService.getAll(currentPage, 8, statusFilter);
      if (Array.isArray(data)) {
        setTables(data);
        setMeta({ totalPages: 1, total: data.length });
      } else if (data && typeof data === 'object') {
        const items = data.items || data.data || [];
        const total = data.meta?.total || items.length;
        const totalPages = data.meta?.totalPages || 1;
        setTables(items);
        setMeta({ totalPages, total });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Stollarni yuklashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // 🪑 Stolni band qilish (`OCCUPIED` holatiga o'tkazish)
  const handleOccupyTable = async (id: string) => {
    try {
      await tableService.occupy(id);
      fetchTables(); // Ekrandagi holatni yangilash
    } catch (err: any) {
      alert(err.response?.data?.message || "Stolni band qilib bo'lmadi.");
    }
  };

  // 🔓 Stolni bo'shatish (`AVAILABLE` holatiga o'tkazish)
  const handleReleaseTable = async (id: string) => {
    try {
      await tableService.release(id);
      fetchTables(); // Ekrandagi holatni yangilash
    } catch (err: any) {
      alert(err.response?.data?.message || "Stolni bo'shatib bo'lmadi.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Sarlavha qismi */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Zal stollari</h1>
        <p className="text-sm text-gray-500">
          Ofitsiant: <span className="font-semibold text-green-600">{user?.fullName || "Tizim a'zosi"}</span>
        </p>
      </div>

      {/* Filtr bo'limi */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1); 
          }}
          className="p-2 border rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
        >
          <option value="">Barcha stollar</option>
          <option value="AVAILABLE">Faqat bo'sh stollar</option>
          <option value="OCCUPIED">Faqat band stollar</option>
        </select>
      </div>

      {/* Xatolik chiqsa */}
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* Stollar ro'yxati */}
      {loading ? (
        <div className="text-center py-10 text-gray-500 font-medium">Stollar yuklanmoqda...</div>
      ) : tables.length === 0 ? (
        <div className="text-center py-14 text-gray-500 border border-dashed border-gray-300 rounded-xl bg-white">
          Xizmat ko'rsatish uchun stollar topilmadi.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <div 
              key={table.id} 
              className={`p-5 border rounded-2xl shadow-sm bg-white flex flex-col justify-between transition-all duration-200 ${
                table.status === 'OCCUPIED' ? 'ring-2 ring-amber-500/20 border-amber-200' : 'hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-xl text-gray-800">Stol #{table.number}</span>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    table.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                    table.status === 'OCCUPIED' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {table.status === 'AVAILABLE' ? "Bo'sh" : table.status === 'OCCUPIED' ? 'Band' : 'Yopiq'}
                  </span>
                </div>
                
                {/* 📍 Stol nomi */}
                {table.name && (
                  <p className="text-xs text-gray-500 font-medium italic mb-2">📍 {table.name}</p>
                )}
                
                <p className="text-sm text-gray-600 mb-3">
                  Mijoz sig'imi: <span className="font-semibold text-gray-900">{table.capacity} kishi</span>
                </p>

                {/* 🤵 Stol band bo'lsa, kim xizmat ko'rsatayotganini ko'rsatadi */}
                {table.status === 'OCCUPIED' && table.occupiedBy && (
                  <div className="text-xs text-amber-800 bg-amber-50/70 p-2 rounded-xl border border-amber-100/50 mt-2">
                    Xizmatda: <span className="font-bold">{table.occupiedBy.fullName}</span>
                  </div>
                )}
              </div>

              {/* ⚡️ Harakat tugmalari */}
              <div className="mt-5 pt-3 border-t border-gray-100">
                {table.status === 'AVAILABLE' ? (
                  <button
                    onClick={() => handleOccupyTable(table.id)}
                    className="w-full py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-xl transition shadow-sm"
                  >
                    Stolni Band Qilish
                  </button>
                ) : table.status === 'OCCUPIED' ? (
                  <button
                    onClick={() => handleReleaseTable(table.id)}
                    className="w-full py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 rounded-xl transition shadow-sm"
                  >
                    Stolni Bo'shatish
                  </button>
                ) : (
                  <div className="text-center py-2 text-xs font-medium text-gray-400 bg-gray-100 rounded-xl">
                    Vaqtincha yopiq
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-3 py-1.5 border rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Orqaga
          </button>
          <span className="text-sm font-medium text-gray-600">Sahifa {currentPage} / {meta.totalPages}</span>
          <button
            disabled={currentPage === meta.totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-3 py-1.5 border rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Oldinga
          </button>
        </div>
      )}
    </div>
  );
}