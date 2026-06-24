import React from "react";
import { Outlet } from "react-router-dom";
import WaiterSidebar from "./components/WaiterSidebar"; // Alohida komponentni import qilish

const WaiterLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF9F6] font-sans antialiased">
      {/* 🧭 Chap tomondagi alohida yozilgan komponentimiz */}
      <WaiterSidebar />

      {/* 🖼️ O'ng tomondagi o'zgaruvchan ichki sahifalar maydoni */}
      <div className="flex-1 h-full overflow-x-hidden overflow-y-auto">
        {/* 
          Siz o'zingiz yozadigan sahifalar (Tables va hk) 
          aynan mana shu Outlet turgan joyda paydo bo'ladi.
        */}
        <Outlet />
      </div>
    </div>
  );
};

export default WaiterLayout;
