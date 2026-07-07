import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Doimiy Navbar (Savat va tillar bilan) */}
      <Navbar />

      {/* Sahifalar yuklanadigan asosiy oyna */}
      <main className="grow">
        <Outlet />
      </main>

      {/* Doimiy Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
