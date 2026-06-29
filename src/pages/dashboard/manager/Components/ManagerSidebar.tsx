import { NavLink, Outlet } from "react-router-dom";

function ManagerSidebar() {
  return (
    <div className="flex min-h-screen bg-[#050811]">
      {/* ⬅️ CHAP TOMON: SIDEBAR (Rasm {ED57CBBA-C445-4BF6-A191-7B69B76D899B}.png dizayniga moslandi) */}
      <div className="w-64 bg-[#080d1a] p-5 flex flex-col justify-between border-r border-slate-900">
        <div>
          {/* Logo */}
          <div className="text-[#00df9a] font-bold text-xl mb-8 p-1 tracking-wider">
            QUAD FRONT
          </div>

          {/* Profil kartasi */}
          <div className="bg-[#0f162a] p-4 rounded-xl mb-6 text-white text-sm border border-slate-800/60">
            <span className="text-[10px] bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded font-bold">
              MANAGER
            </span>
            <h4 className="font-semibold mt-2 text-base">jahon</h4>
            <p className="text-slate-400 text-xs">@jahon</p>
          </div>

          {/* Navigatsiya tugmalari */}
          <nav className="flex flex-col gap-2">
            {/* 1. Dashboard */}
            <NavLink
              to="/manager"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-[#00df9a] text-black font-bold" : "text-slate-400 hover:bg-slate-800/50"}`
              }
            >
              Dashboard
            </NavLink>

            {/* 2. Buyurtmalar */}
            <NavLink
              to="/manager/buyurtmalar"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-[#00df9a] text-black font-bold" : "text-slate-400 hover:bg-slate-800/50"}`
              }
            >
              Buyurtmalar
            </NavLink>

            {/* 3. Menyu (Sizda ishlab turgan tugma) */}
            <NavLink
              to="/manager/create-menu"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-[#00df9a] text-black font-bold" : "text-slate-400 hover:bg-slate-800/50"}`
              }
            >
              Menyu
            </NavLink>

            {/* 4. Mentorlar yozuvi o'rniga Kategoriyalar oynasini ochadigan havolasi */}
            <NavLink
              to="/manager/category"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-[#00df9a] text-black font-bold" : "text-slate-400 hover:bg-slate-800/50"}`
              }
            >
              Kategoriyalar
            </NavLink>
          </nav>
        </div>

        {/* Chiqish */}
        <button className="w-full bg-red-950/20 text-red-400 border border-red-900/30 py-2.5 rounded-xl text-sm font-medium hover:bg-red-950/40 transition-all">
          Chiqish
        </button>
      </div>

      {/* ➡️ O'NG TOMON: SAHIFALAR ALMASHADIGAN JOY */}
      <div className="flex-1 bg-[#050811] flex flex-col">
        {/* Header */}
        <header className="p-6 flex justify-between items-center border-b border-slate-900">
          <h1 className="text-xl font-bold text-white">Manager Dashboard</h1>
          <div className="text-white text-sm bg-[#0f162a] px-3 py-1.5 rounded-lg flex items-center gap-2 border border-slate-800/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> jahon
          </div>
        </header>

        {/* Dinamik Kontent */}
        <main className="flex-1 p-6 text-white">
          {/* 🔴 MANA SHU OUTLET ORQALI QOLGAN SAHIFALAR CHIZILADI */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ManagerSidebar;
