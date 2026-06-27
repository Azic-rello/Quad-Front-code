import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

// Zustand bilan aylanma bog'liqlikni (circular dependency) buzish uchun in-memory token storage
let accessTokenMemory: string | null = null;

// Zustand ichidagi `setAccessToken` yoki boshqa joydan tokenni yangilash funksiyasi
export const setApiAccessToken = (token: string | null) => {
  accessTokenMemory = token;
};

export const $api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

interface BackendError {
  message: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

let isRefreshing = false;
let failedRequestsQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedRequestsQueue.forEach((request) => {
    if (error) request.reject(error);
    else request.resolve(token);
  });
  failedRequestsQueue = [];
};

/**
 * 🔄 Tokenlarni yangilash uchun alohida eksport qilinadigan funksiya
 */
export const refreshAuthTokens = async (): Promise<RefreshResponse> => {
  const refreshToken = Cookies.get("refreshToken");
  if (!refreshToken) {
    throw new Error("Refresh token topilmadi");
  }

  // NestJS jwt-refresh strategiyasi kafolati uchun ham body, ham Bearer header yuboramiz
  const response = await axios.post<RefreshResponse>(
    "http://localhost:3000/auth/refresh",
    { refreshToken },
    { headers: { Authorization: `Bearer ${refreshToken}` } },
  );

  return response.data;
};

// ➡️ Request Interceptor
$api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Agar xotirada bo'lsa, uni srazi header'ga qo'shadi
    if (accessTokenMemory && config.headers) {
      config.headers.Authorization = `Bearer ${accessTokenMemory}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ⬅️ Response Interceptor
$api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<BackendError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) return Promise.reject(error);

    // 🚫 ActiveUserGuard yoki RolesGuard'dan qaytadigan 403 xatosi
    if (error.response?.status === 403) {
      console.error(
        "%c🚫 [Interceptor] 403 Forbidden! Ruxsat cheklangan yoki foydalanuvchi bloklangan.",
        "color: #f87171; font-weight: bold;",
      );
      return Promise.reject(error);
    }

    // 🔄 Token eskirganda (401 Unauthorized)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      console.log(
        "%c⚠️ [Interceptor] 401 Aniqlandi! Token yangilanmoqda...",
        "color: #fbbf24;",
      );

      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return $api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Markazlashtirilgan refresh funksiyasini chaqiramiz
        const data = await refreshAuthTokens();

        // ⚡️ Zustand'ni import qilmasdan turib, xotirani va Zustand holatini yangilaymiz
        accessTokenMemory = data.accessToken;

        // Bu joyda `useAuthStore` orqali Zustand store'ni ham ogohlantiramiz (agar ilova ochiq bo'lsa)
        // Shunda Zustand'da ham accessToken qiymati yangilanadi va o'chib ketmaydi
        try {
          const { useAuthStore } = await import("../modules/auth/authStore");
          useAuthStore.getState().setAccessToken(data.accessToken);
        } catch (storeError) {
          console.warn("Zustand store yuklashda ogohlantirish:", storeError);
        }

        Cookies.set("refreshToken", data.refreshToken, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });

        console.log(
          "%c✅ [Interceptor] Tokenlar silliq yangilandi.",
          "color: #4ade80;",
        );
        processQueue(null, data.accessToken);
        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }
        return $api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        accessTokenMemory = null;
        Cookies.remove("refreshToken");

        // Agar refresh token ham o'lib ketgan bo'lsa, foydalanuvchini login'ga haydaydi
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
