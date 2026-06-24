// src/store/auth.store.ts

import { create } from "zustand";
import Cookies from "js-cookie";
import { $api, setApiAccessToken } from "../../services/api";



interface User {
  id: string;
  username: string;
  role: string;
}

interface LoginDto {
  username: string;
  password: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (data: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
  getMe: () => Promise<void>;

  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setAccessToken: (token) => {
    set({ accessToken: token });
    setApiAccessToken(token);
  },

  login: async (data) => {
    try {
      set({ isLoading: true });

      const response = await $api.post("/auth/login", data);

      const { accessToken, refreshToken, user } = response.data;

      Cookies.set("refreshToken", refreshToken, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      setApiAccessToken(accessToken);

      set({
        user,
        accessToken,
        isAuthenticated: true,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  getMe: async () => {
    try {
      set({ isLoading: true });

      const response = await $api.get("/auth/me");

      set({
        user: response.data,
        isAuthenticated: true,
      });
    } catch {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });

      setApiAccessToken(null);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await $api.post("/auth/logout");
    } catch (error) {
      console.error(error);
    } finally {
      Cookies.remove("refreshToken");

      setApiAccessToken(null);

      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });

      window.location.href = "/auth/login";
    }
  },
}));
