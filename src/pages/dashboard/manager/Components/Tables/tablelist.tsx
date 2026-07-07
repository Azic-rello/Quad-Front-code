import React from 'react';
import { Pen, Trash2, Grid } from 'lucide-react';
import { tableService } from './service';

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'DISABLED';

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  occupiedBy?: { fullName: string } | null;
}

interface TableListProps {
  tables: Table[];
  user: { id: string; role: string } | null;
  onRefresh: () => void;
  onEdit: (table: Table) => void;
}

export const TableList: React.FC<TableListProps> = ({ tables, user, onRefresh, onEdit }) => {
  const isManagerOrAdmin = user?.role === 'MANAGER' || user?.role === 'ADMIN';

  const handleDelete = async (id: string) => {
    if (window.confirm("Stolni o'chirmoqchimisiz?")) {
      try { await tableService.delete(id); onRefresh(); } catch (err: any) { alert(err.response?.data?.message); }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tables.map((table) => {
        // Rasmdagi kabi holat yozuvlari
        let statusText = 'Empty';
        if (table.status === 'OCCUPIED') statusText = `Band (${table.occupiedBy?.fullName || 'Ofitsiant'})`;
        if (table.status === 'RESERVED') statusText = 'Reserved';
        if (table.status === 'DISABLED') statusText = 'Ishlamas';

        return (
          <div 
            key={table.id} 
            className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between"
          >
            {/* Tepasi: Ikonka va Matn */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[#f5f4f0] text-stone-700 rounded-full flex items-center justify-center border border-stone-200/40">
                <Grid className="w-4 h-4 text-stone-800" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900">Table {table.number}</h3>
                <p className="text-xs text-stone-400 font-medium">{statusText}</p>
              </div>
            </div>

            {/* Pasti: Tugmalar paneli (Xuddi rasmdagidek tekislikda) */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onEdit(table)} 
                className="flex-1 flex items-center justify-center space-x-1.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 py-1.5 rounded-xl text-xs font-semibold shadow-2xs transition-all"
              >
                <Pen className="w-3.5 h-3.5 text-stone-600" />
                <span>Tahrirlash</span>
              </button>

              {isManagerOrAdmin && (
                <button 
                  disabled={table.status === 'OCCUPIED'}
                  onClick={() => handleDelete(table.id)} 
                  className="w-9 h-8 flex items-center justify-center bg-[#E30A17] hover:bg-red-700 text-white rounded-xl disabled:opacity-40 transition-all shadow-2xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};