import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Lock, Plus } from 'lucide-react';
import { tableService } from './service';
import { CreateTable } from './CreateTable';
import { TableList } from './tablelist';
import { TableEdit } from './TableEdit';
import { useAuthStore } from '../../../../../modules/auth/authStore';

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const TablesPage: React.FC = () => {
  const [tables, setTables] = useState([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [editingTable, setEditingTable] = useState<any | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  const user = useAuthStore((state: any) => state.user);
  const isManagerOrAdmin = user?.role === 'MANAGER' || user?.role === 'ADMIN';

  const fetchTables = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tableService.getAll(currentPage, 8, statusFilter);
      if (data && data.items) {
        setTables(data.items);
        setMeta(data.meta);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Stollarni yuklashda xatolik.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  return (
    <div className="p-6 bg-[#faf9f6] min-h-screen">
      {/* 🧩 Rasmdagi kabi sarlavha va tugma qatori */}
      <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-2xl border border-stone-200/60 shadow-xs">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-stone-900">Stollar</h1>
          <select 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl text-xs focus:outline-none text-stone-600"
          >
            <option value="">Barchasi</option>
            <option value="AVAILABLE">Bo'sh</option>
            <option value="OCCUPIED">Band</option>
            <option value="RESERVED">Bron</option>
            <option value="DISABLED">Ishlamas</option>
          </select>
        </div>

        {isManagerOrAdmin && (
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-[#E30A17] hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Qo'shish</span>
          </button>
        )}
      </div>

      {/* Form ochilgandagi holat */}
      {showCreateForm && isManagerOrAdmin && (
        <div className="mb-6 animate-fadeIn">
          <CreateTable onSuccess={() => { setCurrentPage(1); fetchTables(); setShowCreateForm(false); }} />
        </div>
      )}

      {!isManagerOrAdmin && (
        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center space-x-2">
          <Lock className="w-4 h-4" />
          <span>Faqat Manager va Admin stollarni boshqara oladi.</span>
        </div>
      )}

      {loading && <p className="text-stone-500 text-xs">Yuklanmoqda...</p>}
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">⚠️ {error}</div>}

      {!loading && tables.length === 0 && (
        <p className="text-stone-400 text-sm text-center py-10">Stollar mavjud emas.</p>
      )}

      {!loading && tables.length > 0 && (
        <>
          <TableList 
            tables={tables} 
            user={user} 
            onRefresh={fetchTables} 
            onEdit={(table) => setEditingTable(table)} 
          />

          {meta && meta.totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center space-x-3">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 bg-white border border-stone-200 rounded-xl disabled:opacity-40 shadow-xs">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-stone-500 font-medium">{meta.page} / {meta.totalPages}</span>
              <button disabled={currentPage === meta.totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 bg-white border border-stone-200 rounded-xl disabled:opacity-40 shadow-xs">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {editingTable && (
        <TableEdit 
          table={editingTable} 
          onClose={() => setEditingTable(null)} 
          onSuccess={fetchTables} 
        />
      )}
    </div>
  );
};

export default TablesPage;