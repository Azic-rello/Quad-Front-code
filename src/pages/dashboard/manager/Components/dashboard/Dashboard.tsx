import React, { useState, useEffect } from "react";
import {
  Users,
  Grid,
  Utensils,
  Newspaper,
  ClipboardList,
  TrendingUp,
  Loader2,
} from "lucide-react";

import { waiterService } from "../../Components/waiter/service";
import { tableService } from "../../Components/Tables/service";
import { productService } from "../products/service/productService";

interface DashboardProps {
  newsCount?: number;
  activeRevenue?: number;
}

const Dashboard: React.FC<DashboardProps> = ({
  newsCount = 2,
  activeRevenue = 195000,
}) => {
  const [waitersCount, setWaitersCount] = useState<number>(0);
  const [isLoadingWaiters, setIsLoadingWaiters] = useState<boolean>(true);

  const [tablesCount, setTablesCount] = useState<number>(0);
  // 1. BU YERDA BOOLEAN BO'LIB QOLGAN EDI, NUMBER QILINDI:
  const [activeTablesCount, setActiveTablesCount] = useState<number>(0);
  const [isLoadingTables, setIsLoadingTables] = useState<boolean>(true);

  const [foodsCount, setFoodsCount] = useState<number>(0);
  const [isLoadingFoods, setIsLoadingFoods] = useState<boolean>(true);

  useEffect(() => {
    const fetchWaitersData = async () => {
      try {
        setIsLoadingWaiters(true);
        const data = await waiterService.getWaiters();
        const filteredWaiters = data.filter((user) => user.role === "WAITER");
        setWaitersCount(filteredWaiters.length);
      } catch (err: unknown) {
        console.error("Dashboard: Waiters yuklashda xatolik:", err);
      } finally {
        setIsLoadingWaiters(false);
      }
    };

    const fetchTablesData = async () => {
      try {
        setIsLoadingTables(true);
        const response = await tableService.getAll(1, 100, "");
        const tablesList = response.items || response.data || [];
        setTablesCount(tablesList.length);

        const occupiedTables = tablesList.filter(
          (table) => table.status === "OCCUPIED",
        );
        setActiveTablesCount(occupiedTables.length);
      } catch (err: unknown) {
        console.error("Dashboard: Tables yuklashda xatolik:", err);
      } finally {
        setIsLoadingTables(false);
      }
    };

    const fetchFoodsData = async () => {
      try {
        setIsLoadingFoods(true);
        const response = await productService.getAll({
          page: 1,
          limit: 1000,
          search: "",
        });
        // 2. BU YERDAN RESPONSE.DATA OLIB TASHLANDI, FAQAT ITEMS TEKSHIRILADI:
        const foodsList = response.items || [];
        setFoodsCount(foodsList.length);
      } catch (err: unknown) {
        console.error("Dashboard: Foods yuklashda xatolik:", err);
      } finally {
        setIsLoadingFoods(false);
      }
    };

    fetchWaitersData();
    fetchTablesData();
    fetchFoodsData();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#FAF9F5] p-6 sm:p-8 font-sans antialiased selection:bg-red-500 selection:text-white">
      <div className="w-full space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
        {/* ─── TEPASI: Sarlavha va Til Tanlash ─── */}
        <div className="flex justify-between items-center select-none">
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Umumiy ma'lumot
          </h1>
        </div>

        {/* ─── STATISTIKA KARTALARI (Kattalashtirilgan va Responsive) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Waiters */}
          <div className="bg-white border border-stone-200/60 rounded-3xl p-8 flex justify-between items-center shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 delay-75 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-3">
              <span className="text-sm font-medium text-stone-400 tracking-wide block">
                Ofitsantlar
              </span>
              {isLoadingWaiters ? (
                <div className="h-10 flex items-center">
                  <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
                </div>
              ) : (
                <h2 className="text-4xl font-bold text-stone-950 tracking-tight">
                  {waitersCount}
                </h2>
              )}
            </div>
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* 2. Tables */}
          <div className="bg-white border border-stone-200/60 rounded-3xl p-8 flex justify-between items-center shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 delay-100 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-3">
              <span className="text-sm font-medium text-stone-400 tracking-wide block">
                Stollar
              </span>
              {isLoadingTables ? (
                <div className="h-10 flex items-center">
                  <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
                </div>
              ) : (
                <h2 className="text-4xl font-bold text-stone-950 tracking-tight">
                  {tablesCount}
                </h2>
              )}
            </div>
            <div className="w-14 h-14 rounded-2xl bg-yellow-400 flex items-center justify-center text-stone-950">
              <Grid className="w-6 h-6" />
            </div>
          </div>

          {/* 3. Foods */}
          <div className="bg-white border border-stone-200/60 rounded-3xl p-8 flex justify-between items-center shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 delay-150 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-3">
              <span className="text-sm font-medium text-stone-400 tracking-wide block">
                Ovqatlar
              </span>
              {isLoadingFoods ? (
                <div className="h-10 flex items-center">
                  <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
                </div>
              ) : (
                <h2 className="text-4xl font-bold text-stone-950 tracking-tight">
                  {foodsCount}
                </h2>
              )}
            </div>
            <div className="w-14 h-14 rounded-2xl bg-yellow-400 flex items-center justify-center text-stone-950">
              <Utensils className="w-6 h-6" />
            </div>
          </div>

          {/* 4. News */}
          <div className="bg-white border border-stone-200/60 rounded-3xl p-8 flex justify-between items-center shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all delay-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-3">
              <span className="text-sm font-medium text-stone-400 tracking-wide block">
                Yangiliklar
              </span>
              <h2 className="text-4xl font-bold text-stone-950 tracking-tight">
                {newsCount}
              </h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-900">
              <Newspaper className="w-6 h-6" />
            </div>
          </div>

          {/* 5. Active Tables */}
          <div className="bg-white border border-stone-200/60 rounded-3xl p-8 flex justify-between items-center shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all delay-250 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-3">
              <span className="text-sm font-medium text-stone-400 tracking-wide block">
                Faol stollar
              </span>
              {isLoadingTables ? (
                <div className="h-10 flex items-center">
                  <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
                </div>
              ) : (
                <h2 className="text-4xl font-bold text-stone-950 tracking-tight">
                  {activeTablesCount}
                </h2>
              )}
            </div>
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>

          {/* 6. Active Revenue */}
          <div className="bg-white border border-stone-200/60 rounded-3xl p-8 flex justify-between items-center shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all delay-300 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-3">
              <span className="text-sm font-medium text-stone-400 tracking-wide block">
                Bugungi Daromad
              </span>
              <h2 className="text-3xl font-bold text-stone-950 tracking-tight">
                {activeRevenue.toLocaleString()} so'm
              </h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-yellow-400 flex items-center justify-center text-stone-950">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* ─── PASTI: QUICK TIPS ─── */}
        <div className="bg-white border border-stone-200/60 rounded-3xl p-8 space-y-4 shadow-xs animate-in fade-in slide-in-from-bottom-4 duration-500 delay-350">
          <h3 className="text-xl font-bold text-stone-950 tracking-tight">
            Foydali maslahatlar
          </h3>

          <ul className="space-y-2.5 text-sm font-normal text-stone-500 pl-0 list-none">
            <li className="flex items-center gap-2">
              <span className="text-stone-300 text-lg leading-none">•</span>
              <span>
                Ofitsiantlar uchun hisob yarating, shunda ular stol
                buyurtmalarini qabul qila oladi.
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-stone-300 text-lg leading-none">•</span>
              <span>Ofitsiantlar uchun stollarni boshqarish.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-stone-300 text-lg leading-none">•</span>
              <span>
                Kuzating{" "}
                <span className="text-red-600 font-semibold cursor-pointer hover:underline transition duration-150">
                  Jonli buyurtmalarni
                </span>{" "}
                ofitsiantlar real vaqt rejimida qo‘shayotgan buyurtmalarni
                ko‘rish uchun.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
