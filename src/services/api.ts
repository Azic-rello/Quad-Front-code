import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

let accessTokenMemory: string | null = null;

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

export const refreshAuthTokens = async () => {
  const refreshToken = Cookies.get("refreshToken");


  const response = await axios.post("http://localhost:3000/auth/refresh", {
    refreshToken,
  });


  return response.data;
};

// Request Interceptor
$api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessTokenMemory && config.headers) {
      config.headers.Authorization = `Bearer ${accessTokenMemory}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
$api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<BackendError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) return Promise.reject(error);

    if (error.response?.status === 403) {
      console.error("🚫 [Interceptor] 403 Forbidden! Ruxsat cheklangan.");
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
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
        const data = await refreshAuthTokens();
        accessTokenMemory = data.accessToken;

        // Zustand store dynamic import orqali yangilanadi
        try {
          const storeModule = await import("../modules/auth/authStore");
          storeModule.useAuthStore.getState().setAccessToken(data.accessToken);
        } catch (storeError) {
          console.warn("Zustand store yuklashda muammo:", storeError);
        }

        Cookies.set("refreshToken", data.refreshToken, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });

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

        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
