import { $api } from "../../../../../services/api";

// ================= TYPES & DTOS =================
export interface UserResponseDto {
  id: string;
  fullName: string;
  username: string;
  role: string;
  status: string;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWaiterDto {
  fullName: string;
  username: string;
  password?: string;
}

export interface UpdateWaiterDto {
  fullName?: string;
  username?: string;
  password?: string;
}

export interface BackendErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

// ================= SERVICE METHODS =================
export const waiterService = {
  /**
   * 🔄 1. Foydalanuvchilar ro'yxatini olish (GET /users)
   * Har qanday formatdagi (o'ralgan yoki o'ralmagan) massivni avtomatik topadi
   */
  getWaiters: async (): Promise<UserResponseDto[]> => {
    const response = await $api.get<unknown>("/users");

    // Ichki massivni xavfsiz qidirib topish uchun yordamchi funksiya
    const findArrayInObject = (target: unknown): UserResponseDto[] | null => {
      if (!target || typeof target !== "object") return null;

      // Agar target'ning o'zi to'g'ridan-to'g'ri massiv bo'lsa
      if (Array.isArray(target)) {
        return target as UserResponseDto[];
      }

      const obj = target as Record<string, unknown>;

      // Standart pagination kalitlarini tekshirish
      if (Array.isArray(obj.data)) return obj.data as UserResponseDto[];
      if (Array.isArray(obj.users)) return obj.users as UserResponseDto[];
      if (Array.isArray(obj.items)) return obj.items as UserResponseDto[];
      if (Array.isArray(obj.rows)) return obj.rows as UserResponseDto[];

      // Dinamik Skaner: Agar yuqoridagilar o'xshamasa, ichidagi birinchi duch kelgan massivni oladi
      for (const key of Object.keys(obj)) {
        const value = obj[key];
        if (Array.isArray(value)) {
          return value as UserResponseDto[];
        }
      }

      return null;
    };

    // Standart AxiosResponse formatini tekshirish (ichida 'data' ustuni borligini)
    if (response && typeof response === "object" && "data" in response) {
      const backendBody = (response as { data: unknown }).data;
      const result = findArrayInObject(backendBody);
      if (result) return result;
    }

    // Har ehtimolga qarshi zaxira tekshiruv
    const backupResult = findArrayInObject(response);
    if (backupResult) return backupResult;

    return [];
  },

  /**
   * ➕ 2. Yangi ofitsiant qo'shish (POST /users)
   * NestJS backend standart bo'yicha yangi foydalanuvchini yaratganda role default 'WAITER' bo'ladi,
   * yoki backend o'zi hal qiladi.
   */
  createWaiter: async (dto: CreateWaiterDto): Promise<UserResponseDto> => {
    // Agar backend rolni qat'iy talab qilsa, unga role: "WAITER" ni majburiy qo'shib yuboramiz
    const body = { ...dto, role: "WAITER" };
    const response = await $api.post<UserResponseDto>("/users", body);
    return response.data;
  },

  /**
   * ✏️ 3. Ofitsiant ma'lumotlarini tahrirlash (PATCH /users/:id)
   * NestJS arxitekturasida qisman yangilash uchun PATCH ishlatiladi
   */
  updateWaiter: async (
    id: string,
    dto: UpdateWaiterDto,
  ): Promise<UserResponseDto> => {
    console.log("PATCH URL:", `/users/${id}`);
    console.log("BODY:", dto);

    const response = await $api.patch<UserResponseDto>(`/users/${id}`, dto);

    console.log("RESPONSE:", response.data);

    return response.data;
  },

  deleteWaiter: async (
    id: string,
  ): Promise<{ success: boolean; message?: string }> => {
    const response = await $api.delete<{ success: boolean; message?: string }>(
      `/users/${id}`,
    );
    return response.data;
  },
};