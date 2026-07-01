import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Pen, Trash2, Grid, CheckCircle, Ban, Plus, X } from 'lucide-react';
import { useAuthStore } from '../../../modules/auth/authStore';

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'DISABLED';

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  occupiedById?: string | null;
  occupiedAt?: string | null;
  occupiedBy?: {
    id: string;
    fullName: string;
    username: string;
    role: string;
  } | null;
}

const TablesManagerPage: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Yangi stol qo'shish xolatlari
  const [newTableNumber, setNewTableNumber] = useState<string>('');
  const [newTableCapacity, setNewTableCapacity] = useState<string>('4');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // 🔥 TAHRIRLASH (EDIT) UCHUN HOLATLAR
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [editNumber, setEditNumber] = useState<string>('');
  const [editCapacity, setEditCapacity] = useState<string>('4');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const token = useAuthStore((state: any) => state.accessToken || state.token);

  // 1. Stollarni yuklash
  const fetchTables = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3000/tables', {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });

      const resData = response.data;
      let finalTables: Table[] = [];

      if (Array.isArray(resData)) {
        finalTables = resData;
      } else if (resData && Array.isArray(resData.data)) {
        finalTables = resData.data;
      } else if (resData && resData.data && Array.isArray(resData.data.data)) {
        finalTables = resData.data.data;
      } else if (resData && Array.isArray(resData.result)) {
        finalTables = resData.result;
      } else if (resData && typeof resData === 'object') {
        const foundArray = Object.values(resData).find(val => Array.isArray(val));
        if (foundArray) finalTables = foundArray as Table[];
      }

      setTables(finalTables);
    } catch (err: any) {
      console.error(err);
      setError("Server bilan aloqada xatolik.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // 2. Yangi stol qo'shish
  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNumber.trim()) return alert("Stol raqamini kiriting!");

    setIsCreating(true);
    try {
      await axios.post('http://localhost:3000/tables', {
        number: Number(newTableNumber),
        capacity: Number(newTableCapacity)
      }, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });

      setNewTableNumber('');
      fetchTables(); 
      alert("Stol muvaffaqiyatli qo'shildi! 🎉");
    } catch (err: any) {
      alert(err.response?.data?.message || "Stol qo'shib bo'lmadi.");
    } finally {
      setIsCreating(false);
    }
  };

  // 🔥 3. TAHRIRLASH OYNASINI OCHISH FUNKSIYASI
  const startEdit = (table: Table) => {
    setEditingTable(table);
    setEditNumber(table.number.toString());
    setEditCapacity(table.capacity.toString());
  };

  // 🔥 4. TAHRIRLANGAN MA'LUMOTNI BACKENDGA SAQLASH (PATCH/PUT)
  const handleUpdateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTable) return;

    setIsUpdating(true);
    try {
      // Backendingizda tahrirlash PATCH yoki PUT bo'ladi (odatda PATCH)
      await axios.patch(`http://localhost:3000/tables/${editingTable.id}`, {
        number: Number(editNumber),
        capacity: Number(editCapacity)
      }, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });

      setEditingTable(null); // Oynani yopish
      fetchTables(); // Ro'yxatni yangilash
      alert("Stol muvaffaqiyatli tahrirlandi! 👍");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Tahrirlashda xatolik yuz berdi.");
    } finally {
      setIsUpdating(false);
    }
  };

  // 5. Stolni bo'shatish
  const handleRelease = async (id: string) => {
    try {
      await axios.post(`http://localhost:3000/tables/${id}/release`, {}, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      fetchTables();
    } catch (err) {
      console.error(err);
    }
  };

  // 6. Statusni o'zgartirish
  const handleChangeStatus = async (id: string, status: TableStatus) => {
    try {
      await axios.patch(`http://localhost:3000/tables/${id}/status`, { status }, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      fetchTables();
    } catch (err) {
      console.error(err);
    }
  };

  // 7. Stolni o'chirish
  const handleDelete = async (id: string) => {
    if (window.confirm("Bu stolni o'chirmoqchimisiz?")) {
      try {
        await axios.delete(`http://localhost:3000/tables/${id}`, {
          headers: { Authorization: token ? `Bearer ${token}` : '' }
        });
        fetchTables();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6 bg-stone-50 min-h-screen relative">
      
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Stollarni boshqarish</h1>
          <p className="text-sm text-stone-500">Restorandagi barcha stollar holati</p>
        </div>
        <button 
          onClick={fetchTables}
          className="bg-stone-200 text-stone-800 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-stone-300 transition"
        >
          Yangilash
        </button>
      </div>

      {/* STOL QO'SHISH FORMASI */}
      <form onSubmit={handleCreateTable} className="mb-8 p-5 bg-white border border-stone-200 rounded-2xl shadow-sm flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-bold text-stone-700 mb-1.5">Stol raqami</label>
          <input 
            type="number" 
            placeholder="Masalan: 5" 
            value={newTableNumber}
            onChange={(e) => setNewTableNumber(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:border-stone-900 text-gray-900"
            required
          />
        </div>
        
        <div className="w-[120px]">
          <label className="block text-xs font-bold text-stone-700 mb-1.5">Sig'imi</label>
          <select 
            value={newTableCapacity}
            onChange={(e) => setNewTableCapacity(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-stone-900 text-gray-900"
          >
            <option value="2">2 kishi</option>
            <option value="4">4 kishi</option>
            <option value="6">6 kishi</option>
            <option value="8">8 kishi</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={isCreating}
          className="bg-[#E30A17] text-white font-bold py-2 px-5 rounded-xl text-sm hover:bg-red-700 transition-all flex items-center space-x-1.5 h-[38px] disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Qo\'shilmoqda...' : 'Stol qo\'shish'}</span>
        </button>
      </form>

      {loading && <p className="text-stone-600 text-sm">Yuklanmoqda...</p>}
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* STOLLAR RO'YXATI */}
      {!loading && !error && tables.length === 0 && (
        <p className="text-stone-500 text-sm text-center py-10">Bazada stollar mavjud emas yoki topilmadi.</p>
      )}

      {!loading && tables.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
          {tables.map((table) => {
            let uzbStatus = 'Bo\'sh';
            let statusColor = 'text-green-500 font-bold';

            if (table.status === 'OCCUPIED') {
              uzbStatus = 'Band';
              statusColor = 'text-red-500 font-bold';
            } else if (table.status === 'RESERVED') {
              uzbStatus = 'Bron qilingan';
              statusColor = 'text-amber-500 font-bold';
            } else if (table.status === 'DISABLED') {
              uzbStatus = 'Ishlamas';
              statusColor = 'text-stone-400 font-medium line-through';
            }

            return (
              <div key={table.id} className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-stone-100 text-stone-700 rounded-2xl flex items-center justify-center shrink-0">
                        <Grid className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900 text-base">{table.number}-Stol</h3>
                        <p className={`text-sm ${statusColor}`}>{uzbStatus}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-stone-50 text-stone-600 font-semibold px-2.5 py-1 rounded-lg border border-stone-200/40">
                      {table.capacity} kishi
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="flex gap-2">
                    {table.status === 'OCCUPIED' && (
                      <button onClick={() => handleRelease(table.id)} className="w-full flex items-center justify-center space-x-1.5 bg-amber-50 text-amber-700 border border-amber-200/60 py-1.5 px-3 rounded-xl text-xs font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Bo'shatish</span>
                      </button>
                    )}
                    {table.status !== 'OCCUPIED' && (
                      <button onClick={() => handleChangeStatus(table.id, table.status === 'DISABLED' ? 'AVAILABLE' : 'DISABLED')} className={`w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold border ${table.status === 'DISABLED' ? 'bg-green-50 text-green-700 border-green-200/60' : 'bg-stone-50 text-stone-600 border-stone-200/60'}`}>
                        <Ban className="w-3.5 h-3.5" />
                        <span>{table.status === 'DISABLED' ? 'Aktivlashtirish' : 'Bloklash'}</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 w-full">
                    {/* 🔥 ENdi bu tugma startEdit funksiyasini chaqiradi */}
                    <button onClick={() => startEdit(table)} className="flex-1 flex items-center justify-center space-x-2 bg-stone-50 border border-stone-200/60 text-stone-800 py-2 px-4 rounded-xl text-sm font-semibold">
                      <Pen className="w-4 h-4 text-stone-700" strokeWidth={2.5} />
                      <span>Tahrirlash</span>
                    </button>
                    <button disabled={table.status === 'OCCUPIED'} onClick={() => handleDelete(table.id)} className="w-10 h-10 flex items-center justify-center bg-[#e31221] text-white rounded-xl disabled:opacity-40">
                      <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🖥️ CHIROYLI TAHRIRLASH MODAL OYNASI (POPUP) */}
      {editingTable && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-stone-900">{editingTable.number}-Stolni tahrirlash</h2>
              <button onClick={() => setEditingTable(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTable} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">Yangi Stol Raqami</label>
                <input 
                  type="number" 
                  value={editNumber}
                  onChange={(e) => setEditNumber(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-stone-900 text-stone-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">Yangi Sig'imi (Kishi)</label>
                <select 
                  value={editCapacity}
                  onChange={(e) => setEditCapacity(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-stone-900 text-stone-900 font-medium"
                >
                  <option value="2">2 kishilik</option>
                  <option value="4">4 kishilik</option>
                  <option value="6">6 kishilik</option>
                  <option value="8">8 kishilik</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setEditingTable(null)}
                  className="flex-1 bg-stone-100 text-stone-700 font-bold py-2.5 rounded-xl text-sm hover:bg-stone-200 transition"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="flex-1 bg-stone-900 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-stone-800 transition disabled:opacity-50"
                >
                  {isUpdating ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TablesManagerPage;