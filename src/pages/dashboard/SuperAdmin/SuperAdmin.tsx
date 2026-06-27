import { useState, useEffect } from "react";
import { $api } from "../../../services/api";
import UserCreate from "./Components/UserCreate";
import UserEdit from "./Components/UserEdit";
import UserDelete from "./Components/UserDelete";
import { useAuthStore } from "../../../modules/auth/authStore";
import { LogOut } from "lucide-react"; // Chiroyli logout ikonka uchun

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-start items-center p-4 sm:p-8 gap-y-12 relative overflow-hidden select-none">
      {/* 🌀 DAXSHATLI AYLANIB TURADIGAN NEON DISK EFFEKTLARI (NASTOLKA STYLE) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-[spin_30s_linear_infinite]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-[spin_20s_linear_infinite_reverse]" />
      <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[100px] animate-pulse" />

      {/* 🚪 LOGOUT TUGMASI (O'ng yuqori burchakda daxshatli dizaynda) */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-30">
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-900/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-md backdrop-blur-md active:scale-95 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Tizimdan Chiqish</span>
        </button>
      </div>

      {/* Sarlavha qismi */}
      <div className="flex flex-col items-center justify-center space-y-6 z-10 w-full mt-10">
        <div className="text-center tracking-widest space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-[0.1em]">
            Super Admin
          </h1>
          <p className="text-[10px] text-purple-400/60 font-mono tracking-[0.4em]">
            INTERCEPTOR SECURE CONNECT // CONTROL PANEL
          </p>
        </div>

        {isCreating ? (
          <div className="w-full max-w-xl animate-fade-in z-20">
            <UserCreate
              onClose={() => setIsCreating(false)}
              onAddManager={handleAddManager}
            />
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-xl shadow-purple-900/30 border border-purple-500/20 hover:shadow-purple-600/20 active:scale-95 transition-all cursor-pointer"
          >
            + Yangi Manager Yaratish
          </button>
        )}
      </div>

      {/* Managerlar Ro'yxati Konteyneri */}
      <div className="w-full max-w-4xl z-10 mt-4 px-2">
        <div className="border-t border-slate-900/60 pt-6">
          <div className="bg-slate-900/20 border border-slate-900 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
            {managers.length === 0 ? (
              <p className="text-center text-slate-600 text-xs py-12 font-mono tracking-widest">
                BAZADA MANAGERLAR TOPILMADI.
              </p>
            ) : (
              <div className="divide-y divide-slate-900/60">
                {managers.map((manager) => (
                  <div
                    key={manager.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 sm:p-6 gap-4 hover:bg-slate-900/40 transition-all duration-200"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200 tracking-wide">
                        {manager.fullName || manager.username}
                      </h4>
                      <p className="text-xs text-purple-400/50 font-mono mt-1">
                        @{manager.username}
                      </p>
                    </div>
                    {/* Kirish tugmasi olib tashlandi, faqat Tahrirlash va O'chirish qoldi */}
                    <div className="flex space-x-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => setEditingManager(manager)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-blue-400 hover:text-blue-300 text-xs font-bold rounded-xl border border-slate-800 transition-all active:scale-95 cursor-pointer"
                      >
                        Tahrirlash
                      </button>
                      <button
                        onClick={() => setDeletingManager(manager)}
                        className="px-4 py-2 bg-slate-900/60 hover:bg-rose-950/30 text-rose-500 hover:text-rose-400 text-xs font-bold rounded-xl border border-transparent hover:border-rose-500/20 transition-all active:scale-95 cursor-pointer"
                      >
                        O'chirish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
