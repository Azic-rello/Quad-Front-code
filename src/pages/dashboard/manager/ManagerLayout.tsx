import React from "react";
import { Outlet } from "react-router-dom";
// O'zingiz ochgan manager components ichidagi sidebar import qilinadi
import ManagerSidebar from "./Components/ManagerSidebar";

const ManagerLayout: React.FC = () => {
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* 👑 Faqat menejerga tegishli katta Sidebar */}
      <ManagerSidebar />

      {/* Menejerning ishchi maydoni */}
      <div className="flex-1 flex flex-col h-full overflow-x-hidden overflow-y-auto bg-slate-50">
        <header className="h-16 border-b bg-white flex items-center px-8 font-bold text-xl text-gray-800">
          Menejer Boshqaruv Tizimi
        </header>

        <main className="p-6 flex-1">
          {/* Menejerning pages papkasidagi sahifalar shu yerga tushadi */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
