import React from 'react';
import { Pen, Trash2, Grid, CheckCircle, Ban } from 'lucide-react';

// Tiplarni o'z joyida saqlab qoldik (Backend bilan bog'lanish uchun inglizcha qoladi)
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

interface TableListProps {
  tables: Table[];
  onEdit: (table: Table) => void;
  onDelete: (id: string) => void;
  onRelease: (id: string) => void;
  onChangeStatus: (id: string, status: TableStatus) => void;
}

const TableList: React.FC<TableListProps> = ({ 
  tables, 
  onEdit, 
  onDelete, 
  onRelease, 
  onChangeStatus 
}) => {
  
  // Statuslarni o'zbekcha matnga o'giramiz (Ekranda ko'rinishi uchun)
  const getStatusText = (status: TableStatus) => {
    switch (status) {
      case 'AVAILABLE': return 'Bo\'sh';
      case 'OCCUPIED': return 'Band';
      case 'RESERVED': return 'Bron qilingan';
      case 'DISABLED': return 'Ishlamas';
      default: return 'Bo\'sh';
    }
  };

  // Status ranglarini o'zbekcha ma'nosiga qarab chiroyli moslashtiramiz
  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'OCCUPIED': return 'text-red-500 font-bold';
      case 'RESERVED': return 'text-amber-500 font-bold';
      case 'DISABLED': return 'text-stone-400 font-medium line-through';
      default: return 'text-green-500 font-bold'; // Bo'sh bo'lganda yashil rangda chiroyli chiqadi
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
      {tables.map((table) => (
        <div 
          key={table.id} 
          className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[220px] transition-all hover:shadow-md"
        >
          {/* Asosiy ma'lumotlar bloki */}
          <div>
            {/* Tepasi: Icon va Stol ma'lumotlari */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                {/* Dumaloq ichidagi Stol Ikonkasi (Rasmdagi kabi jigar/kulrang fonda) */}
                <div className="w-12 h-12 bg-stone-100 text-stone-700 rounded-2xl flex items-center justify-center shrink-0">
                  <Grid className="w-5 h-5" strokeWidth={2.5} />
                </div>
                
                {/* Stol Nomi va O'zbekcha Statusi */}
                <div>
                  <h3 className="font-bold text-stone-900 text-base">
                    {table.number}-Stol
                  </h3>
                  <p className={`text-sm ${getStatusColor(table.status)}`}>
                    {getStatusText(table.status)}
                  </p>
                </div>
              </div>

              {/* Sig'imi (O'zbekcha matnda) */}
              <span className="text-xs bg-stone-50 text-stone-600 font-semibold px-2.5 py-1 rounded-lg border border-stone-200/40">
                {table.capacity} kishi
              </span>
            </div>

            {/* Ofitsiant info bloki (Agar stol band bo'lsa) */}
            {table.status === 'OCCUPIED' && table.occupiedBy && (
              <div className="mb-4 p-2.5 bg-red-50/60 border border-red-100 text-[11px] text-red-800 rounded-xl space-y-0.5">
                <p><span className="text-red-600/80 font-medium">Ofitsiant:</span> <b>{table.occupiedBy.fullName}</b></p>
                <p><span className="text-red-600/80 font-medium">Vaqt:</span> <b>{table.occupiedAt ? new Date(table.occupiedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</b></p>
              </div>
            )}
          </div>

          {/* Amallar paneli (Tugmalar) */}
          <div className="space-y-2 mt-4">
            {/* Bo'shatish yoki Aktivlashtirish/Bloklash qatori */}
            <div className="flex gap-2">
              {table.status === 'OCCUPIED' && (
                <button 
                  onClick={() => onRelease(table.id)}
                  className="w-full flex items-center justify-center space-x-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/60 py-1.5 px-3 rounded-xl text-xs font-semibold transition"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Bo'shatish</span>
                </button>
              )}
              
              {table.status !== 'OCCUPIED' && (
                <button 
                  onClick={() => onChangeStatus(table.id, table.status === 'DISABLED' ? 'AVAILABLE' : 'DISABLED')}
                  className={`w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold border transition ${
                    table.status === 'DISABLED' 
                      ? 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200/60' 
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200/60'
                  }`}
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>{table.status === 'DISABLED' ? 'Aktivlashtirish' : 'Bloklash'}</span>
                </button>
              )}
            </div>

            {/* Tahrirlash va O'chirish (Siz yuborgan rasmdagi asosiy chiroyli tugmalar) */}
            <div className="flex items-center space-x-2 w-full">
              {/* Tahrirlash tugmasi (Keng oq tugma) */}
              <button
                onClick={() => onEdit(table)}
                className="flex-1 flex items-center justify-center space-x-2 bg-stone-50 hover:bg-stone-100 border border-stone-200/60 text-stone-800 py-2 px-4 rounded-xl text-sm font-semibold transition active:scale-[0.98]"
              >
                <Pen className="w-4 h-4 text-stone-700" strokeWidth={2.5} />
                <span>Tahrirlash</span>
              </button>

              {/* O'chirish tugmasi (Kvadrat yorqin qizil tugma) */}
              <button
                disabled={table.status === 'OCCUPIED'}
                onClick={() => onDelete(table.id)}
                className="w-10 h-10 flex items-center justify-center bg-[#e31221] hover:bg-red-700 text-white rounded-xl transition active:scale-[0.98] shrink-0 shadow-sm shadow-red-200 disabled:opacity-40 disabled:hover:bg-[#e31221] disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableList;