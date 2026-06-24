import React, { useState, type FormEvent } from "react";

interface Manager {
  id: string;
  username: string;
  fullName: string;
}

interface UserEditProps {
  manager: Manager;
  onClose: () => void;
  onUpdateManager: (
    id: string,
    fullName: string,
    username: string,
  ) => Promise<void>;
}

const UserEdit: React.FC<UserEditProps> = ({
  manager,
  onClose,
  onUpdateManager,
}) => {
  const [fullName, setFullName] = useState(manager.fullName);
  const [username, setUsername] = useState(manager.username);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim()) return;

    try {
      setLoading(true);
      await onUpdateManager(manager.id, fullName, username);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-left">
        <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
          <h3 className="text-xs font-mono uppercase tracking-widest text-blue-400">
            Ma'lumotlarni Tahrirlash
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-200 text-xs font-mono cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-slate-400">
              To'liq ismi
            </label>
            <input
              type="text"
              required
              disabled={loading}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-900 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-600 transition-all text-slate-200 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-slate-400">
              Foydalanuvchi nomi
            </label>
            <input
              type="text"
              required
              disabled={loading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-900 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-blue-600 transition-all text-slate-200 font-mono"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800/60 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-slate-400 text-xs font-mono rounded-lg transition-all cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono rounded-lg shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Saqlanmoqda..." : "Yangilash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEdit;
