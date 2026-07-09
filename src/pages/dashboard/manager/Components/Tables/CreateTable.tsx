import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { tableService } from './service';

interface CreateTableProps {
  onSuccess: () => void;
}

export const CreateTable: React.FC<CreateTableProps> = ({ onSuccess }) => {
  const [newTableNumber, setNewTableNumber] = useState<string>('');
  const [newTableCapacity, setNewTableCapacity] = useState<string>('4');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNumber.trim()) return alert("Stol raqamini kiriting!");
//vbt
    setIsCreating(true);
    try {
      await tableService.create({
        number: Number(newTableNumber),
        capacity: Number(newTableCapacity)
      });
      setNewTableNumber('');
      onSuccess();
      alert("Stol muvaffaqiyatli qo'shildi! 🎉");
    } catch (err: any) {
      alert(err.response?.data?.message || "Stol qo'shishda xatolik.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form onSubmit={handleCreateTable} className="mb-8 p-5 bg-white border border-stone-200 rounded-2xl shadow-sm flex flex-wrap items-end gap-4">
      <div className="flex-1 min-w-37.5">
        <label className="block text-xs font-bold text-stone-700 mb-1.5">Stol raqami</label>
        <input 
          type="number" 
          placeholder="Masalan: 5" 
          value={newTableNumber}
          onChange={(e) => setNewTableNumber(e.target.value)}
          className="w-full bg-stone-50 border border-stone-200 px-4 py-2 rounded-xl text-sm text-stone-900 focus:outline-none"
          required
        />
      </div>
      <div className="w-30">
        <label className="block text-xs font-bold text-stone-700 mb-1.5">Sig'imi</label>
        <select 
          value={newTableCapacity}
          onChange={(e) => setNewTableCapacity(e.target.value)}
          className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl text-sm text-stone-900 focus:outline-none"
        >
          <option value="2">2 kishi</option>
          <option value="4">4 kishi</option>
          <option value="6">6 kishi</option>
          <option value="8">8 kishi</option>
        </select>
      </div>
      <button type="submit" disabled={isCreating} className="bg-[#E30A17] text-white font-bold py-2 px-5 rounded-xl text-sm hover:bg-red-700 flex items-center space-x-1.5 h-10.5 disabled:opacity-50">
        <Plus className="w-4 h-4" />
        <span>{isCreating ? 'Qo\'shilmoqda...' : 'Stol qo\'shish'}</span>
      </button>
    </form>
  );
};