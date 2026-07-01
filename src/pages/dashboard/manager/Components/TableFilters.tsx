import React from 'react';

// Tiplarni hech qayerdan import qilmaymiz, shu yerda e'lon qilamiz
export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'DISABLED';

interface FiltersProps {
  currentFilter: TableStatus | 'ALL';
  onFilterChange: (filter: TableStatus | 'ALL') => void;
}

const TableFilters: React.FC<FiltersProps> = ({ currentFilter, onFilterChange }) => {
  const statuses: (TableStatus | 'ALL')[] = ['ALL', 'AVAILABLE', 'OCCUPIED', 'RESERVED', 'DISABLED'];

  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onFilterChange(status)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${
            currentFilter === status
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border'
          }`}
        >
          {status === 'ALL' ? 'Hammasi' : status}
        </button>
      ))}
    </div>
  );
};

export default TableFilters;