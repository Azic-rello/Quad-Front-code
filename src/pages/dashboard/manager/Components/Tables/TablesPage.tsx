import React, { useState, useEffect, useCallback } from "react";
import { tableService, type Table } from "./service"; 
import { Edit2, Trash2, Users, Plus, RefreshCw, Layers } from "lucide-react";

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [meta, setMeta] = useState({ totalPages: 1, total: 0 });
  
  // Modallar
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  // Form statelari (Endi faqat bitta "Stol nomi/raqami" maydoni bor)
  const [newTableIdentifier, setNewTableIdentifier] = useState<string>( "");
  const [newTableCapacity, setNewTableCapacity] = useState<string>("2");
  
  const [updateTableIdentifier, setUpdateTableIdentifier] = useState<string>(""); 
  const [updateTableCapacity, setUpdateTableCapacity] = useState<string>("2");

  const [modalError, setModalError] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  // 🔄 Ma'lumotlarni yuklash
  const fetchTables = useCallback(async () => {
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
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // ➕ Yangi stol yaratish
  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    
    if (!newTableIdentifier.trim()) {
      setModalError("Stol nomini kiriting!");
      return;
    }

    setModalLoading(true);
    try {
      // Backend raqam (number) kutayotgan bo'lsa raqamga o'giradi, matn bo'lsa name'ga tenglaydi
      const isNum = !isNaN(Number(newTableIdentifier));
      await tableService.create({
        number: isNum ? Number(newTableIdentifier) : Math.floor(Math.random() * 10000), 
        name: newTableIdentifier.trim(),
        capacity: Number(newTableCapacity),
      });
      setNewTableIdentifier("");
      setIsCreateModalOpen(false);
      fetchTables(); 
    } catch (err: any) {
      setModalError(err.response?.data?.message || "Stol qo'shib bo'lmadi.");
    } finally {
      setModalLoading(false);
    }
  };

  // ✏️ Tahrirlash modalini ochish
  const openUpdateModal = (table: Table) => {
    setSelectedTable(table);
    setUpdateTableIdentifier(table.name || table.number.toString()); 
    setUpdateTableCapacity(table.capacity.toString()); 
    setIsUpdateModalOpen(true);
  };

  // ✏️ Tahrirlashni saqlash
  const handleUpdateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable) return;
    setModalLoading(true);
    setModalError(null);
    try {
      const isNum = !isNaN(Number(updateTableIdentifier));
      await tableService.update(selectedTable.id, { 
        name: updateTableIdentifier.trim(),
        capacity: Number(updateTableCapacity) 
      });
      setIsUpdateModalOpen(false);
      setSelectedTable(null);
      fetchTables(); 
    } catch (err: any) {
      setModalError(err.response?.data?.message || "Tahrirlashda xatolik yuz berdi.");
    } finally {
      setModalLoading(false);
    }
  };

  // ❌ O'chirish
  const handleDeleteTable = async (id: string, identifier: string | number) => {
    if (!window.confirm(`Rostdan ham "${identifier}" stolni o'chirmoqchimisiz?`)) return;
    try {
      await tableService.delete(id);
      fetchTables();
    } catch (err: any) {
      alert(err.response?.data?.message || "Stolni o'chirib bo'lmadi.");
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto bg-gray-50/50 min-h-screen rounded-2xl sm:rounded-3xl">
      {/* 🚀 Header (Responsive flex-col va sm:flex-row) */}
      <div className="bg-white border border-gray-100 p-4 sm:p-6 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Layers className="text-blue-600 w-5 sm:w-6 h-5 sm:h-6" /> Stollar Boshqaruvi
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
            Jami: <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold text-xs">{meta.total} ta stol</span>
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition active:scale-95 flex items-center justify-center gap-2 font-semibold shadow-md shadow-blue-600/10 text-sm sm:text-base"
        >
          <Plus className="w-4 sm:w-5 h-4 sm:h-5" /> Yangi Stol Qo'shish
        </button>
      </div>

      {/* 🔍 Filtrlar (Mobil versiyada chiroyli joylashadi) */}
      <div className="mb-6 flex justify-between items-center gap-2">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="w-full sm:w-auto p-2.5 border border-gray-200 rounded-xl bg-white shadow-sm font-medium text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
        >
          <option value="">Barcha stollar</option>
          <option value="AVAILABLE">Bo'sh stollar</option>
          <option value="OCCUPIED">Band stollar</option>
          <option value="DISABLED">Ishlamayotganlar</option>
        </select>
        <button onClick={fetchTables} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95 text-gray-500 transition shadow-sm shrink-0">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && <div className="p-4 mb-6 text-sm font-medium text-red-700 bg-red-50 border border-red-100 rounded-xl">{error}</div>}

      {/* 🗂 Stollar Grid (Responsiveness: 1 col, 2 col, 3 col, 4 col) */}
      {tables.length === 0 ? (
        <div className="text-center py-20 text-gray-400 border border-dashed border-gray-200 rounded-2xl bg-white font-medium text-sm">
          Hozircha stol topilmadi.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {tables.map((table) => {
            const currentIdentifier = table.name || `Stol #${table.number}`;
            return (
              <div key={table.id} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    {/* Yagona Stol Nomi / Raqami */}
                    <span className="font-extrabold text-base sm:text-lg text-gray-900 tracking-tight break-all line-clamp-2">
                      {currentIdentifier}
                    </span>
                    <span className={`px-2 py-0.5 text-[9px] font-black rounded-lg uppercase tracking-wider shadow-sm shrink-0 ${
                      table.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      table.status === 'OCCUPIED' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                      {table.status === 'AVAILABLE' ? "Bo'sh" : table.status === 'OCCUPIED' ? 'Band' : 'Yopiq'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 font-medium mt-1">
                    <Users className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-400" />
                    <span>Sig'imi: <b className="text-gray-900">{table.capacity} kishi</b></span>
                  </div>
                </div>

                {/* 🛠 Ikonkali tugmalar */}
                <div className="flex gap-2 border-t border-gray-50 pt-3 sm:pt-4 mt-4 sm:mt-5">
                  <button onClick={() => openUpdateModal(table)} className="flex-1 py-2 text-xs font-bold text-blue-600 bg-blue-50/60 hover:bg-blue-100 rounded-xl transition flex items-center justify-center gap-1.5">
                    <Edit2 className="w-3.5 h-3.5" /> Tahrirlash
                  </button>
                  <button onClick={() => handleDeleteTable(table.id, currentIdentifier)} className="px-3 py-2 text-rose-600 bg-rose-50/60 hover:bg-rose-100 rounded-xl transition flex items-center justify-center">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 sm:gap-3 mt-10">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="px-3 sm:px-4 py-2 border border-gray-200 text-xs sm:text-sm font-semibold rounded-xl bg-white hover:bg-gray-50 disabled:opacity-40 transition shadow-sm">Orqaga</button>
          <span className="text-xs sm:text-sm font-bold text-gray-500 bg-white px-2.5 sm:px-3 py-2 border border-gray-100 rounded-xl shadow-sm">Sahifa {currentPage} / {meta.totalPages}</span>
          <button disabled={currentPage === meta.totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="px-3 sm:px-4 py-2 border border-gray-200 text-xs sm:text-sm font-semibold rounded-xl bg-white hover:bg-gray-50 disabled:opacity-40 transition shadow-sm">Oldinga</button>
        </div>
      )}

      {/* Modal: Create */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 sm:p-6 border border-gray-100 mx-2">
            <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-4 flex items-center gap-2"><Plus className="text-blue-600" /> Yangi Stol Qo'shish</h2>
            <form onSubmit={handleCreateTable} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Stol Nomi / Raqami</label>
                <input type="text" value={newTableIdentifier} onChange={(e) => setNewTableIdentifier(e.target.value)} placeholder="Masalan: VIP Xona yoki 5" className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Sig'imi</label>
                <select value={newTableCapacity} onChange={(e) => setNewTableCapacity(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 cursor-pointer">
                  <option value="2">2 kishilik</option>
                  <option value="4">4 kishilik</option>
                  <option value="6">6 kishilik</option>
                  <option value="8">8 kishilik</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border rounded-xl text-xs sm:text-sm font-bold text-gray-600 hover:bg-gray-50">Bekor qilish</button>
                <button type="submit" disabled={modalLoading} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-blue-700">Yaratish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update */}
      {isUpdateModalOpen && selectedTable && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 sm:p-6 border border-gray-100 mx-2">
            <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-1 flex items-center gap-2"><Edit2 className="text-blue-600 w-4 sm:w-5 h-4 sm:h-5" /> Stolni Tahrirlash</h2>
            <p className="text-xs text-gray-400 font-semibold mb-4">Stol ma'lumotlarini o'zgartirish</p>
            {modalError && <div className="p-3 mb-4 text-xs font-semibold text-red-700 bg-red-50 rounded-xl">{modalError}</div>}
            
            <form onSubmit={handleUpdateTable} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Stol Nomi / Raqami</label>
                <input type="text" value={updateTableIdentifier} onChange={(e) => setUpdateTableIdentifier(e.target.value)} placeholder="Masalan: VIP xona 1" className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Sig'imi</label>
                <select value={updateTableCapacity} onChange={(e) => setUpdateTableCapacity(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none text-sm font-medium text-gray-700 cursor-pointer">
                  <option value="2">2 kishilik</option>
                  <option value="4">4 kishilik</option>
                  <option value="6">6 kishilik</option>
                  <option value="8">8 kishilik</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-50">
                <button type="button" onClick={() => { setIsUpdateModalOpen(false); setSelectedTable(null); }} className="px-4 py-2 border rounded-xl text-xs sm:text-sm font-bold text-gray-600 hover:bg-gray-50">Bekor qilish</button>
                <button type="submit" disabled={modalLoading} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-emerald-700">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}