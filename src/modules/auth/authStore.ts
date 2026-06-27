import { create } from "zustand";
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
  setTokens: (accessToken: string, user: User) => void;
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
    setApiAccessToken(token);

    set({
      accessToken: token,
      isAuthenticated: !!token,
    });
  },

  setTokens: (accessToken, user) => {
    setApiAccessToken(accessToken);

    set({
      user,
      accessToken,
      isAuthenticated: true,
    });
  },

  login: async (data) => {
    try {
      set({ isLoading: true });

      const response = await $api.post("/auth/login", data);

      const { accessToken, user } = response.data;

      setApiAccessToken(accessToken);

      set({
        user,
        accessToken,
        isAuthenticated: true,
      });
      return response.data;
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
      setApiAccessToken(null);

      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await $api.post("/auth/logout");
    } catch (err) {
      console.error(err);
    } finally {
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
