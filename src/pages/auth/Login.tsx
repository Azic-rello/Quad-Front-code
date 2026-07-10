import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../../modules/auth/authStore";
import { AxiosError } from "axios";
import { useState, type FormEvent } from "react";

// Backenddan keladigan xatolik strukturasi turi
interface BackendErrorResponse {
  message: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // Inputlar va funksional holatlar (Aniq tiplangan)
  const [email, setEmail] = useState<string>("mustafo-bek"); // UI bo'yicha email, backendga username sifatida yuboriladi
  const [password, setPassword] = useState<string>("123456");


  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    try {
      setIsLoading(true);

      // Backend bizdan username kutgani uchun inputdagi qiymatni username sifatida yuboramiz
      const data = await login({
        username: email,
        password,
      });
      if (((data as any).user as any)?.role === "ADMIN") {
        return navigate("/admin"); // Agar foydalanuvchi ADMIN bo'lmasa, dashboardga yo'naltirish
      } else if (((data as any).user as any)?.role === "MANAGER") {
        return navigate("/manager"); // Agar foydalanuvchi MANAGER bo'lsa, manager panelga yo'naltirish
      } else if (((data as any).user as any)?.role === "WAITER") {
        return navigate("/waiter"); // Agar foydalanuvchi WAITER bo'lsa, waiter panelga yo'naltirish
      } else {
        setError("Foydalanuvchi roli noma'lum");
      }
    } catch (err) {
      // Axios xat
      // oligini any ishlatmasdan toza tiplash
      const axiosError = err as AxiosError<BackendErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        "Tizimga kirishda xatolik yuz berdi";

      setError(
        message === "Invalid credentials"
          ? "Foydalanuvchi nomi yoki parol noto‘g‘ri"
          : message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-[#E30A17] via-[#F25A1D] to-[#F2B705] p-4 sm:p-6 md:p-8 select-none font-sans">
      <div className="w-full max-w-105 bg-white rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-6 sm:p-10 space-y-6 transition-all duration-300 transform hover:scale-[1.01]">
        {/* ⬅️ Chiroyli orqaga qaytish tugmasi */}
        <button
          type="button"
          onClick={() => navigate("/")}
          disabled={isLoading}
          className="flex items-center space-x-2 text-xs font-bold text-gray-400 hover:text-[#E30A17] transition-colors group cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Orqaga</span>
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#E30A17] rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto shadow-lg shadow-red-600/20 active:scale-95 transition-transform cursor-pointer">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 fill-none stroke-current"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="20" x2="18" y2="20" />
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-gray-950 tracking-tight">
            Quad<span className="text-[#E30A17]">Pizza</span>
          </h2>
          <p className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">
            Sign In
          </p>
        </div>

        {/* Xatolik xabarini ko'rsatish (Dizayn bloklariga mos ravishda) */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-xs font-semibold text-red-600 text-center animate-pulse">
            {error}
          </div>
        )}

        {/* Forma qismi (Minimalist & Clean) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email / Username Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 ml-1">
              Email
            </label>
            <input
              type="text" // Backend username/email qabul qilishi uchun text qilingani ma'qul
              required
              disabled={isLoading}
              placeholder="example@burger.uz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/5 transition-all text-gray-900 placeholder:text-gray-300 font-medium shadow-sm disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 px-4 pr-11 py-2.5 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/5 transition-all text-gray-900 placeholder:text-gray-300 font-medium shadow-sm disabled:bg-gray-50 disabled:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Sign In Tugmasi */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E30A17] text-white font-bold py-3 rounded-xl shadow-lg shadow-red-600/10 hover:bg-red-700 active:scale-[0.98] transition-all text-center text-sm font-sans mt-3 tracking-wide disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Kirilmoqda...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
