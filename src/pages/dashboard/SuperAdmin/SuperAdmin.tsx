import { useState, useEffect } from "react";
import { $api } from "../../../services/api";
import UserCreate from "./Components/UserCreate";
import UserEdit from "./Components/UserEdit";
import UserDelete from "./Components/UserDelete";
import { useAuthStore } from "../../../modules/auth/authStore";
import {
  LogOut,
  Settings,
  UserPlus,
  Shield,
  User,
  Settings2,
  Trash2,
} from "lucide-react";

interface Manager {
  id: string;
  username: string;
  fullName: string;
  role: "MANAGER";
}

const SuperAdmin = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [editingManager, setEditingManager] = useState<Manager | null>(null);
  const [deletingManager, setDeletingManager] = useState<Manager | null>(null);

  // Zustand'dan logout funksiyasini olamiz
  const logout = useAuthStore((state) => state.logout);

  // Barcha foydalanuvchilarni olish
  const fetchManagers = async (retryCount = 0): Promise<void> => {
    try {
      const response = await $api.get("/users");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.items || [];
      const filtered = data.filter(
        (u: any) => u.role?.toUpperCase() === "MANAGER",
      );
      setManagers(filtered);
    } catch (error: any) {
      if (error?.response?.status === 401 && retryCount < 1) {
        setTimeout(() => {
          fetchManagers(retryCount + 1);
        }, 300);
        return;
      }
      console.error("Managerlarni yuklashda xatolik:", error);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  // 1. Yangi manager qo'shish
  const handleAddManager = async (
    username: string,
    fullName: string,
    password: string,
  ) => {
    try {
      await $api.post("/users", {
        username,
        fullName,
        password,
        role: "MANAGER",
      });
      fetchManagers();
      setIsCreating(false);
    } catch (error) {
      console.error("Manager yaratishda xatolik:", error);
    }
  };

  // 2. Managerni tahrirlash
  const handleUpdateManager = async (
    id: string,
    updatedName: string,
    updatedUsername: string,
  ) => {
    try {
      await $api.patch(`/users/${id}`, {
        fullName: updatedName,
        username: updatedUsername,
      });
      fetchManagers();
      setEditingManager(null);
    } catch (error) {
      console.error("Tahrirlashda xatolik:", error);
    }
  };

  // 3. Managerni o'chirish
  const handleDeleteConfirm = async () => {
    if (deletingManager) {
      try {
        await $api.delete(`/users/${deletingManager.id}`);
        fetchManagers();
        setDeletingManager(null);
      } catch (error) {
        console.error("O'chirishda xatolik:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-start items-center p-4 sm:p-8 gap-y-8 relative overflow-hidden select-none font-sans antialiased">
      {/* 🌀 ORQA FON EFFEKTLARI (CYBERPUNK NEON STYLE) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-[spin_40s_linear_infinite]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-[spin_30s_linear_infinite_reverse]" />
      <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-teal-500/5 rounded-full blur-[100px] animate-pulse" />

      {/* 🚪 LOGOUT TUGMASI */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-30">
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-900/60 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-800/80 hover:border-red-500/30 font-medium rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-lg backdrop-blur-md active:scale-95 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Chiqish</span>
        </button>
      </div>

      {/* Sarlavha qismi */}
      <div className="flex flex-col items-center justify-center space-y-4 z-10 w-full mt-12 sm:mt-8">
        <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 px-3 py-1 rounded-full text-[10px] font-semibold text-purple-400 tracking-widest uppercase shadow-inner">
          <Shield className="w-3 h-3 text-purple-400 animate-pulse" />
          <span>Xavfsiz Root terminali</span>
        </div>

        <div className="text-center tracking-widest space-y-1">
          <h1 className="text-3xl sm:text-5xl font-black uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-300 to-slate-500 tracking-[0.12em]">
            Super Admin
          </h1>
          <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono tracking-[0.3em]">
            INTERCEPTOR XAVFSIZ ULANISH // BOSHQARUV PANELI
          </p>
        </div>

        {/* ⚙️ O'RTADA AYLANIB TURUVCHI KATALASHGAN VA YONIB-OCHADIGAN NASTROYKA ICONI */}
        <div className="relative py-6 group animate-pulse">
          {/* Neon nur tarqalishi (O'chib-yonuvchi pulsatsiya) */}
          <div
            className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full scale-125 opacity-80 group-hover:opacity-100 transition-opacity duration-500 animate-ping"
            style={{ animationDuration: "3s" }}
          />
          <div className="absolute inset-0 bg-indigo-500/30 blur-xl rounded-full scale-110 opacity-90" />

          {/* Katta o'lchamli premium sozlamalar ikonasi */}
          <Settings className="w-24 h-24 sm:w-28 sm:h-28 text-purple-400/80 group-hover:text-purple-400 border border-purple-500/20 p-3 rounded-3xl bg-slate-900/50 shadow-2xl shadow-purple-500/10 animate-[spin_20s_linear_infinite] relative z-10 transition-colors duration-500" />
        </div>

        {isCreating ? (
          <div className="w-full max-w-xl animate-fade-in z-20 mt-2">
            <UserCreate
              onClose={() => setIsCreating(false)}
              onAddManager={handleAddManager}
            />
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-purple-950/40 border border-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
          >
            <UserPlus className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>Yangi Manager Yaratish</span>
          </button>
        )}
      </div>

      {/* Managerlar Ro'yxati Konteyneri */}
      <div className="w-full max-w-3xl z-10 mt-2 px-1">
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="px-5 py-4 bg-slate-900/40 border-b border-slate-800/50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
              Foydalanuvchilar ({managers.length})
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {managers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 space-y-3">
              <User className="w-8 h-8 text-slate-700" />
              <p className="text-center text-slate-500 text-xs font-mono tracking-wider uppercase">
                Bazada managerlar topilmadi.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/40">
              {managers.map((manager) => (
                <div
                  key={manager.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 gap-4 hover:bg-slate-900/60 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3.5 w-full sm:w-auto">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-purple-500/30 transition-colors duration-300 shadow-inner">
                      <User className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors duration-300" />
                    </div>
                    <div className="truncate min-w-0">
                      <h4 className="text-sm font-semibold text-slate-200 tracking-wide truncate">
                        {manager.fullName || manager.username}
                      </h4>
                      <p className="text-xs text-purple-400/60 font-mono mt-0.5 truncate">
                        @{manager.username}
                      </p>
                    </div>
                  </div>

                  {/* Boshqaruv tugmalari */}
                  <div className="flex space-x-2 w-full sm:w-auto justify-end border-t border-slate-800/40 sm:border-0 pt-3 sm:pt-0">
                    <button
                      onClick={() => setEditingManager(manager)}
                      className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-blue-400 hover:text-blue-300 text-xs font-semibold rounded-xl border border-slate-800 hover:border-slate-700 transition-all active:scale-95 cursor-pointer"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                      <span>Tahrirlash</span>
                    </button>
                    <button
                      onClick={() => setDeletingManager(manager)}
                      className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-950 hover:bg-red-950/30 text-red-400 hover:text-red-300 text-xs font-semibold rounded-xl border border-slate-800 hover:border-red-900/30 transition-all active:scale-95 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>O'chirish</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modallar */}
      {editingManager && (
        <UserEdit
          manager={editingManager}
          onClose={() => setEditingManager(null)}
          onUpdateManager={handleUpdateManager}
        />
      )}
      {deletingManager && (
        <UserDelete
          managerName={deletingManager?.fullName || deletingManager?.username}
          onClose={() => setDeletingManager(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default SuperAdmin;
