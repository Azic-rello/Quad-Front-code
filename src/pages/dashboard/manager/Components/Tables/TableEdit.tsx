import React, { useState } from 'react';
import { X } from 'lucide-react';
import { tableService } from './service';

interface Table {
  id: string;
  number: number;
  capacity: number;
}

interface TableEditProps {
  table: Table;
  onClose: () => void;
  onSuccess: () => void;
}

export const TableEdit: React.FC<TableEditProps> = ({ table, onClose, onSuccess }) => {
  const [editCapacity, setEditCapacity] = useState<string>(table.capacity.toString());
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const handleUpdateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await tableService.update(table.id, {
        capacity: Number(editCapacity)
      });
      onSuccess();
      alert("Stol sig'imi yangilandi! 👍");
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Tahrirlashda xatolik.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-stone-900">{table.number}-Stolni tahrirlash</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleUpdateTable} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Yangi Sig'imi</label>
            <select 
              value={editCapacity}
              onChange={(e) => setEditCapacity(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl text-sm text-stone-900 focus:outline-none"
            >
              <option value="2">2 kishilik</option>
              <option value="4">4 kishilik</option>
              <option value="6">6 kishilik</option>
              <option value="8">8 kishilik</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-stone-100 text-stone-700 font-bold py-2.5 rounded-xl text-sm">
              Bekor qilish
            </button>
            <button type="submit" disabled={isUpdating} className="flex-1 bg-stone-900 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50">
              {isUpdating ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};