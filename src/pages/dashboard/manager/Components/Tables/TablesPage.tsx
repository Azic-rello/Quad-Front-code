import React, { useState, useEffect, useCallback } from "react";
// O'zingdagi service.ts faylining joylashgan to'g'ri yo'lini yozasan:
import { tableService, type Table } from "../Tables/service"; 

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination va Filtrlar
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [meta, setMeta] = useState({ totalPages: 1, total: 0 });
  
  // Modallar holati
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  // Yangi stol formasi uchun statelar
  const [newTableNumber, setNewTableNumber] = useState<string>("");
  const [newTableCapacity, setNewTableCapacity] = useState<string>("2");
  
  // Tahrirlash formasi uchun state
  const [updateTableCapacity, setUpdateTableCapacity] = useState<string>("2");

  const [modalError, setModalError] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  // 🔄 Stollarni backenddan yuklash
  const fetchTables = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tableService.getAll(currentPage, 8, statusFilter);
      console.log("🍏 Backenddan kelgan ma'lumot:", data);

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
      console.error("🔴 Stollarni yuklashda xato:", err);
      setError(err.response?.data?.message || "Stollarni yuklashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // ➕ Yangi stol qo'shish
  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!newTableNumber || Number(newTableNumber) <= 0) {
      setModalError("Iltimos, stol raqamini to'g'ri kiriting!");
      return;
    }

    setModalLoading(true);
    try {
      await tableService.create({
        number: Number(newTableNumber),
        capacity: Number(newTableCapacity),
      });
      
      setNewTableNumber("");
      setNewTableCapacity("2");
      setIsCreateModalOpen(false);
      fetchTables(); 
    } catch (err: any) {
      if (err.response?.status === 409) {
        setModalError(`Stol #${newTableNumber} allaqachon mavjud!`);
      } else {
        setModalError(err.response?.data?.message || "Stol qo'shib bo'lmadi.");
      }
    } finally {
      setModalLoading(false);
    }
  };

  // ✏️ Stolni tahrirlash oynasini ochish
  const openUpdateModal = (table: Table) => {
    setSelectedTable(table);
    setUpdateTableCapacity(table.capacity.toString());
    setIsUpdateModalOpen(true);
  };

  // ✏️ Stolni tahrirlash (Saqlash)
  const handleUpdateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable) return;

    setModalLoading(true);
    setModalError(null);
    try {
      await tableService.update(selectedTable.id, {
        capacity: Number(updateTableCapacity)
      });
      setIsUpdateModalOpen(false);
      setSelectedTable(null);
      fetchTables(); // Ekranni yangilash
    } catch (err: any) {
      setModalError(err.response?.data?.message || "Tahrirlashda xatolik yuz berdi.");
    } finally {
      setModalLoading(false);
    }
  };

  // ❌ Stolni o'chirish
  const handleDeleteTable = async (id: string, number: number) => {
    if (!window.confirm(`Rostdan ham #${number}-stolni o'chirmoqchimisiz?`)) {
      return;
    }

    try {
      await tableService.delete(id);
      fetchTables(); // O'chgandan keyin ro'yxatni srazu yangilash
    } catch (err: any) {
      alert(err.response?.data?.message || "Stolni o'chirib bo'lmadi.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Yuqori qism */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Stollar Boshqaruvi</h1>
          <p className="text-sm text-gray-500">Umumiy stollar soni: {meta.total} ta</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          + Yangi Stol Qo'shish
        </button>
      </div>

      {/* Filtr bo'limi */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1); 
          }}
          className="p-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Barcha stollar</option>
          <option value="AVAILABLE">Bo'sh</option>
          <option value="OCCUPIED">Band</option>
          <option value="DISABLED">Ishlamayapti</option>
        </select>
      </div>

      {/* Xatolik xabari */}
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
          <strong>Xato:</strong> {error}
        </div>
      )}

      {/* Stollar ro'yxati */}
      {loading ? (
        <div className="text-center py-10 text-gray-500 font-medium">Stollar yuklanmoqda...</div>
      ) : tables.length === 0 ? (
        <div className="text-center py-14 text-gray-500 border border-dashed border-gray-300 rounded-xl bg-gray-50">
          Stollar topilmadi.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <div key={table.id} className="p-4 border rounded-xl shadow-sm bg-white flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-gray-800">Stol #{table.number}</span>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    table.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                    table.status === 'OCCUPIED' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {table.status === 'AVAILABLE' ? "Bo'sh" : table.status === 'OCCUPIED' ? 'Band' : 'Yopiq'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Sig'imi: <span className="font-medium text-gray-900">{table.capacity}</span> kishilik</p>
              </div>

              {/* 🛠️ Tahrirlash va O'chirish tugmalari */}
              <div className="flex gap-2 border-t pt-3 mt-2">
                <button
                  onClick={() => openUpdateModal(table)}
                  className="flex-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-center"
                >
                  Tahrirlash
                </button>
                <button
                  onClick={() => handleDeleteTable(table.id, table.number)}
                  className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition text-center"
                >
                  O'chirish
                </button>
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

      {/* 📋 OYNA: Yangi Stol Qo'shish (Create) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Yangi Stol Qo'shish</h2>
            {modalError && <div className="p-3 mb-4 text-xs text-red-700 bg-red-50 rounded-lg border border-red-200">{modalError}</div>}
            <form onSubmit={handleCreateTable} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stol Raqami</label>
                <input
                  type="number"
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(e.target.value)}
                  placeholder="Masalan: 5"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sig'imi</label>
                <select
                  value={newTableCapacity}
                  onChange={(e) => setNewTableCapacity(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="2">2 kishilik</option>
                  <option value="4">4 kishilik</option>
                  <option value="6">6 kishilik</option>
                  <option value="8">8 kishilik</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">Bekor qilish</button>
                <button type="submit" disabled={modalLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  {modalLoading ? "Saqlanmoqda..." : "Yaratish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✏️ OYNA: Stolni Tahrirlash (Update) */}
      {isUpdateModalOpen && selectedTable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Stolni Tahrirlash</h2>
            <p className="text-sm text-gray-500 mb-4">Stol #{selectedTable.number} ma'lumotlarini o'zgartirish</p>
            {modalError && <div className="p-3 mb-4 text-xs text-red-700 bg-red-50 rounded-lg border border-red-200">{modalError}</div>}
            <form onSubmit={handleUpdateTable} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yangi Sig'imi</label>
                <select
                  value={updateTableCapacity}
                  onChange={(e) => setUpdateTableCapacity(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="2">2 kishilik</option>
                  <option value="4">4 kishilik</option>
                  <option value="6">6 kishilik</option>
                  <option value="8">8 kishilik</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setIsUpdateModalOpen(false); setSelectedTable(null); }} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">Bekor qilish</button>
                <button type="submit" disabled={modalLoading} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
                  {modalLoading ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}