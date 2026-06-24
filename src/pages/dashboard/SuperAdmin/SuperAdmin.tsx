import { useState, useEffect } from "react";
import { $api } from "../../../services/api";
import UserCreate from "./Components/UserCreate";
import UserEdit from "./Components/UserEdit";
import UserDelete from "./Components/UserDelete";

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

  // Barcha foydalanuvchilarni olish (Xato mana shu funksiyada to'g'rilandi)
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
      // ⚠️ To'g'rilandi: Arrow funksiya (=>) olib tashlandi
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

  // Yangi manager qo'shish
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

  // Managerni tahrirlash
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

  // Managerni o'chirish
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

  const handleLoginAsManager = (manager: Manager) => {
    localStorage.setItem("current_user", JSON.stringify(manager));
    window.location.href = "/dashboard/manager";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-start items-center p-4 sm:p-8 gap-y-12 relative overflow-x-hidden select-none">
      {/* Orqa fondagi neon effektlar */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl" />

      <div className="flex flex-col items-center justify-center space-y-6 z-10 w-full mt-6">
        <div className="text-center tracking-widest space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
            Super Admin
          </h1>
          <p className="text-[10px] text-purple-400/60 font-mono tracking-[0.3em]">
            INTERCEPTOR SECURE CONNECT
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
            className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-purple-900/20 active:scale-95 transition-all cursor-pointer"
          >
            + Yangi Manager Yaratish
          </button>
        )}
      </div>

      {/* Managerlar Ro'yxati Konteyneri */}
      <div className="w-full max-w-4xl z-10 mt-4 px-2">
        <div className="border-t border-slate-900 pt-6">
          <div className="bg-slate-900/40 border border-slate-900 rounded-xl overflow-hidden backdrop-blur-md">
            {managers.length === 0 ? (
              <p className="text-center text-slate-600 text-xs py-8 font-mono">
                Bazada managerlar topilmadi.
              </p>
            ) : (
              <div className="divide-y divide-slate-900">
                {managers.map((manager) => (
                  <div
                    key={manager.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 gap-4 hover:bg-slate-900/60 transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">
                        {manager.fullName || manager.username}
                      </h4>
                      <p className="text-xs text-purple-400/50 font-mono mt-0.5">
                        @{manager.username}
                      </p>
                    </div>
                    <div className="flex space-x-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => handleLoginAsManager(manager)}
                        className="px-3 py-1.5 bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 text-xs font-bold rounded-lg border border-emerald-500/20 transition-all cursor-pointer"
                      >
                        Kirish 🚪
                      </button>
                      <button
                        onClick={() => setEditingManager(manager)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-bold rounded-lg transition-all cursor-pointer"
                      >
                        Tahrirlash
                      </button>
                      <button
                        onClick={() => setDeletingManager(manager)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-red-950/30 text-rose-500 text-xs font-bold rounded-lg transition-all cursor-pointer"
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
