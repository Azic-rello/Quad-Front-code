import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Tiplarni shu yerning o'zida e'lon qilamiz, import xatosi bo'lmasligi uchun
type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'DISABLED';

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  occupiedById?: string | null;
  occupiedAt?: string | null;
}

interface TableFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingTable: Table | null;
  apiUrl: string;
}

const TableFormModal: React.FC<TableFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  editingTable, 
  apiUrl 
}) => {
  const [number, setNumber] = useState<number>(1);
  const [capacity, setCapacity] = useState<number>(4);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Agar tahrirlash (Edit) rejimi bo'lsa, inputlarga eski qiymatlarni o'rnatamiz
  useEffect(() => {
    if (editingTable) {
      setNumber(editingTable.number);
      setCapacity(editingTable.capacity);
    } else {
      setNumber(1);
      setCapacity(4);
    }
  }, [editingTable, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingTable) {
        // Tahrirlash: PATCH http://localhost:3000/tables/:id
        await axios.patch(`${apiUrl}/${editingTable.id}`, { capacity });
      } else {
        // Yangi qo'shish: POST http://localhost:3000/tables
        await axios.post(apiUrl, { number, capacity });
      }
      onSuccess(); // Muwaffaqiyatli bo'lsa ro'yxatni yangilash
    } catch (error: any) {
      alert(error.response?.data?.message || "Saqlashda xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {editingTable ? `${editingTable.number}-Stolni tahrirlash` : "Yangi Stol Qo'shish"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stol Raqami</label>
            <input 
              type="number" 
              disabled={!!editingTable} // Tahrirlashda raqamni o'zgartirib bo'lmaydi (Backend qoidalari)
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
              min={1} 
              max={999} 
              required
              className="w-full border rounded-lg p-2 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sig'imi (Kishi soni)</label>
            <input 
              type="number" 
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              min={1} 
              max={20} 
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 transition"
            >
              Bekor qilish
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {submitting ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableFormModal;