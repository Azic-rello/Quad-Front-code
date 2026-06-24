import React, { useState, type FormEvent } from "react";

interface UserCreateProps {
  onClose: () => void;
  onAddManager: (
    username: string,
    fullName: string,
    password: string,
  ) => Promise<void>;
}

const UserCreate: React.FC<UserCreateProps> = ({ onClose, onAddManager }) => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // Jonli parol inputi
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !password.trim()) return;

    try {
      setLoading(true);
      await onAddManager(username, fullName, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-900 p-6 rounded-2xl shadow-xl backdrop-blur-md w-full space-y-4 text-left">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-xs font-mono uppercase tracking-widest text-purple-400">
          Yangi Manager Profilini Sozlash
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[11px] font-mono uppercase text-slate-400">
            To'liq ismi (Full Name)
          </label>
          <input
            type="text"
            required
            disabled={loading}
            placeholder="Alisher Navoiy"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-900 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-purple-600 transition-all text-slate-200 placeholder:text-slate-700 font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono uppercase text-slate-400">
            Foydalanuvchi nomi (Username)
          </label>
          <input
            type="text"
            required
            disabled={loading}
            placeholder="alisher_manager"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-slate-950 border border-slate-900 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-purple-600 transition-all text-slate-200 placeholder:text-slate-700 font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono uppercase text-slate-400">
            Maxfiy Parol (Password)
          </label>
          <input
            type="password"
            required
            disabled={loading}
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-950 border border-slate-900 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-purple-600 transition-all text-slate-200 placeholder:text-slate-700 font-mono tracking-widest"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800/60">
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
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 text-white text-xs font-mono rounded-lg shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Yaratilmoqda..." : "Saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserCreate;
