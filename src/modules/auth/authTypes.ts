export type Role = "ADMIN" | "MANAGER" | "WAITER" | "SUPERADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export interface User {
  id: string;
  fullName: string;
  username: string;
  role: Role;
  status: UserStatus;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface BackendError {
  message: string;
}
