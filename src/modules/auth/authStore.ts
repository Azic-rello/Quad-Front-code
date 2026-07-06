import { create } from "zustand";
import Cookies from "js-cookie";
import axios from "axios";
import { $api, setApiAccessToken } from "../../services/api";
import type { AuthResponse, LoginDto, User } from "./authTypes";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean; // Ilova boshlang'ich tekshiruvdan o'tganini bilish uchun

  login: (data: LoginDto) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  getMe: () => Promise<void>;
  setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  setAccessToken: (token) => {
    setApiAccessToken(token);
    set({
      accessToken: token,
      isAuthenticated: !!token,
    });
  },

  login: async (data) => {
    try {
      set({ isLoading: true });
      const response = await $api.post<AuthResponse>("/auth/login", data);
      const { accessToken, refreshToken, user } = response.data;

      setApiAccessToken(accessToken);

      Cookies.set("refreshToken", refreshToken, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      set({
        user,
        accessToken,
        isAuthenticated: true,
        isInitialized: true,
      });

      return response.data;
    } finally {
      set({ isLoading: false });
    }
  },

  getMe: async () => {
    try {
      set({ isLoading: true });
      const response = await $api.get<User>("/auth/me");

      set({
        user: response.data,
        isAuthenticated: true,
        isInitialized: true,
      });
    } catch (error) {
      console.error("⚠️ [getMe] Xatolik aniqlandi:", error);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setApiAccessToken(null);
        Cookies.remove("refreshToken");
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isInitialized: true,
        });
      } else {
        // 403 Forbidden (Manager huquqi yetmaganda) cookiega tegmaymiz!
        set({
          user: null,
          isAuthenticated: false,
          isInitialized: true,
        });
      }
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await $api.post("/auth/logout");
    } catch (err) {
      console.error("Logout xatoligi:", err);
    } finally {
      setApiAccessToken(null);
      Cookies.remove("refreshToken");

      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isInitialized: false,
      });

      window.location.href = "/";
    }
  },
}));
