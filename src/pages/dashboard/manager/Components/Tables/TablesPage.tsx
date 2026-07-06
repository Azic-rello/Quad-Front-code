import React, { useState, useEffect, useCallback } from "react";
import { tableService, type Table } from "./service"; 
import { Edit2, Trash2, Plus, Grid } from "lucide-react";

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

  // Form statelari
  const [tableIdentifier, setTableIdentifier] = useState<string>("");
  const [tableCapacity, setTableCapacity] = useState<string>("2");

  const [modalError, setModalError] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  // 🔄 Ma'lumotlarni yuklash
  const fetchTables = useCallback(async () => {
    setError(null);
    try {
      const data = await tableService.getAll(currentPage, 12, statusFilter);
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
      setError(err.response?.data?.message || "Stollarni yuklashda xatolik.");
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // 🔢 Faqat raqam kiritishni tekshirish
  const handleNumberChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setTableIdentifier(value);
    }
  };

  // ➕ Yangi Stol Yaratish
  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!tableIdentifier.trim()) {
      setModalError("Stol raqamini kiriting!");
      return;
    }
    setModalLoading(true);
    try {
      // 🛠 Toza son ko'rinishida yuboriladi
      await tableService.create({
        number: Number(tableIdentifier),
        name: tableIdentifier.trim(), 
        capacity: Number(tableCapacity),
      });
      setTableIdentifier("");
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
    // Name yoki Number'dan faqat toza sonni ajratib olib inputga qo'yamiz
    const numericOnly = table.name ? table.name.replace(/\D/g, "") : table.number.toString();
    setTableIdentifier(numericOnly || table.number.toString());
    setTableCapacity(table.capacity.toString());
    setIsUpdateModalOpen(true);
  };

  // ✏️ Tahrirlashni saqlash (To'liq Fix qilindi 🚀)
  const handleUpdateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable) return;
    setModalLoading(true);
    setModalError(null);
    try {
      // 🛠 CHALCOSHLIKNING ASOSIY YECHIMI:
      // Name va Number maydonlariga foydalanuvchi kiritgan toza sonni bir xil qilib yuboramiz.
      // Shunda backend interfeysi qanday bo'lishidan qat'iy nazar 100% qabul qiladi.
      await tableService.update(selectedTable.id, {
        number: Number(tableIdentifier),
        name: tableIdentifier.trim(), 
        capacity: Number(tableCapacity)
      });
      
      setIsUpdateModalOpen(false);
      setSelectedTable(null);
      setTableIdentifier("");
      fetchTables(); // Ekranni srazu yangilash
    } catch (err: any) {
      setModalError(err.response?.data?.message || "Tahrirlashda backend rad etdi.");
    } finally {
      setModalLoading(false);
    }
  };

  // ❌ O'chirish
  const handleDeleteTable = async (id: string, currentNum: number) => {
    if (!window.confirm(`Rostdan ham shu stolni o'chirmoqchimisiz?`)) return;
    try {
      await tableService.delete(id);
      fetchTables();
    } catch (err: any) {
      alert(err.response?.data?.message || "Stol o'chirilmadi.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#faf9f6] p-4 sm:p-6 font-sans">
      
      {/* 🚀 Rasmdagi Oq Chiroyli Konteyner */}
      <div className="bg-white rounded-3xl border border-stone-100 p-6 shadow-sm max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">Stollar</h1>
          <button
            onClick={() => {
              setTableIdentifier("");
              setTableCapacity("2");
              setIsCreateModalOpen(true);
            }}
            className="px-5 py-2.5 bg-[#e31221] hover:bg-[#c90f1b] text-white rounded-2xl transition active:scale-95 flex items-center gap-2 font-semibold text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" /> Qo'shish
          </button>
        </div>

        {error && <div className="p-4 mb-6 text-sm font-medium text-red-700 bg-red-50 rounded-2xl">{error}</div>}

        {/* 🗂 Grid Kontent */}
        {tables.length === 0 ? (
          <div className="text-center py-16 text-stone-400 font-medium text-sm">Hozircha stollar yo'q.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map((table) => {
              // Agar name son bo'lsa "Table 5" qilib chiroyli ko'rsatish, matn bo'lsa o'zini chiqarish
              const isOnlyNum = /^\d+$/.test(table.name || "");
              const displayName = isOnlyNum ? `Table ${table.name}` : (table.name || `Table ${table.number}`);
              const displayStatus = table.status === "OCCUPIED" ? "Busy" : "Empty";

              return (
                <div 
                  key={table.id} 
                  className="bg-white border border-stone-200/70 rounded-3xl p-5 flex flex-col justify-between transition-shadow hover:shadow-md"
                >
                  {/* Info */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#faf9f6] flex items-center justify-center shrink-0 border border-stone-100">
                      <Grid className="w-5 h-5 text-stone-800" />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-stone-900 text-base truncate">{displayName}</h3>
                      <p className="text-xs font-medium text-stone-400 mt-0.5">{displayStatus}</p>
                    </div>
                  </div>

                  {/* 🛠 Pastki Tugmalar */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => openUpdateModal(table)}
                      className="flex-1 py-2.5 px-4 border border-stone-200 hover:bg-stone-50 text-stone-800 font-semibold rounded-2xl text-xs transition flex items-center justify-center gap-2 bg-white"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-stone-700" /> Tahrirlash
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteTable(table.id, table.number)}
                      className="w-10 h-10 bg-[#e31221] hover:bg-[#c90f1b] text-white rounded-2xl transition flex items-center justify-center shrink-0 shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 📋 Modal: Yaratish */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 border border-stone-100">
            <h2 className="text-lg font-bold text-stone-900 mb-4">Yangi stol qo'shish</h2>
            <form onSubmit={handleCreateTable} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Stol raqami (Faqat son)</label>
                <input 
                  type="text" 
                  inputMode="numeric"
                  value={tableIdentifier} 
                  onChange={(e) => handleNumberChange(e.target.value)} 
                  placeholder="Masalan: 5" 
                  className="w-full p-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#e31221] focus:outline-none text-sm font-medium" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Sig'imi</label>
                <select value={tableCapacity} onChange={(e) => setTableCapacity(e.target.value)} className="w-full p-3 border border-stone-200 rounded-2xl bg-white text-sm font-medium text-stone-800 focus:outline-none">
                  <option value="2">2 kishilik</option>
                  <option value="4">4 kishilik</option>
                  <option value="6">6 kishilik</option>
                  <option value="8">8 kishilik</option>
                </select>
              </div>
              {modalError && <p className="text-xs font-semibold text-red-600">{modalError}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-stone-500 font-semibold text-sm hover:bg-stone-50 rounded-xl transition">Bekor qilish</button>
                <button type="submit" disabled={modalLoading} className="px-5 py-2 bg-[#e31221] text-white font-semibold text-sm rounded-xl hover:bg-[#c90f1b] transition">Yaratish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📋 Modal: Tahrirlash */}
      {isUpdateModalOpen && selectedTable && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 border border-stone-100">
            <h2 className="text-lg font-bold text-stone-900 mb-4">Stolni tahrirlash</h2>
            <form onSubmit={handleUpdateTable} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Stol raqami (Faqat son)</label>
                <input 
                  type="text" 
                  inputMode="numeric"
                  value={tableIdentifier} 
                  onChange={(e) => handleNumberChange(e.target.value)} 
                  className="w-full p-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#e31221] focus:outline-none text-sm font-medium" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Sig'imi</label>
                <select value={tableCapacity} onChange={(e) => setTableCapacity(e.target.value)} className="w-full p-3 border border-stone-200 rounded-2xl bg-white text-sm font-medium text-stone-800 focus:outline-none">
                  <option value="2">2 kishilik</option>
                  <option value="4">4 kishilik</option>
                  <option value="6">6 kishilik</option>
                  <option value="8">8 kishilik</option>
                </select>
              </div>
              {modalError && <p className="text-xs font-semibold text-red-600">{modalError}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setIsUpdateModalOpen(false); setSelectedTable(null); }} className="px-4 py-2 text-stone-500 font-semibold text-sm hover:bg-stone-50 rounded-xl transition">Bekor qilish</button>
                <button type="submit" disabled={modalLoading} className="px-5 py-2 bg-[#e31221] text-white font-semibold text-sm rounded-xl hover:bg-[#c90f1b] transition">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}