import React from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout: React.FC = () => {
  return (
    <div className="w-screen h-screen bg-gray-100 font-sans antialiased overflow-hidden">
      {/* 
        Menejer yoki Ofitsiantning o'z maxsus layoutlari va sahifalari 
        aynan mana shu Outlet o'rniga kelib o'tiradi.
      */}
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
