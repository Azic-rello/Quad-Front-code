import { $api } from "../../services/api";
import type { AuthResponse, LoginDto, User } from "./authTypes";

export const authApi = {
  /**
   * Tizimga kirish
   */
  login: async (dto: LoginDto): Promise<AuthResponse> => {
    const { data } = await $api.post<AuthResponse>("/auth/login", dto);
    return data;
  },

  /**
   * Foydalanuvchi profili va holatini olish (JwtAuthGuard + ActiveUserGuard tekshiruvi uchun)
   */
  getMe: async (): Promise<User> => {
    const { data } = await $api.get<User>("/auth/me");
    return data;
  },
};
