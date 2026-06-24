import React, { useState } from "react";

interface UserDeleteProps {
  managerName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const UserDelete: React.FC<UserDeleteProps> = ({
  managerName,
  onClose,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-4">
        <div className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center mx-auto text-sm font-mono border border-rose-500/20">
          ⚠️
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-200">
            Profil o'chirish
          </h3>
          <p className="text-xs text-slate-400 font-mono leading-relaxed px-2">
            Haqiqatdan ham{" "}
            <span className="text-rose-400 font-bold">"{managerName}"</span> ni
            tizimdan butunlay o'chirmoqchimisiz?
          </p>
        </div>

        <div className="flex space-x-2 pt-2 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2 bg-slate-950 hover:bg-slate-900 text-slate-400 text-xs font-mono rounded-lg transition-all cursor-pointer"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono rounded-lg shadow-lg shadow-rose-900/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {loading ? "O'chirilmoqda..." : "O'chirish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDelete;
