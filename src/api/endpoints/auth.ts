import { apiClient } from "../client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  admin: {
    adminId: string;
    email: string;
    token?: string;
  };
}

export interface TotalCountResponse {
  totalUsers: number;
  totalProducts: number;
  totalPosts: number;
}
export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>("/admin/signIn", credentials);
  },
  totalCount: async (): Promise<TotalCountResponse> => {
    return apiClient.get<TotalCountResponse>("/admin/count");
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiClient.post<RegisterResponse>("/auth/register", data);
  },

  logout: async (): Promise<LogoutResponse> => {
    return apiClient.post<LogoutResponse>("/auth/logout");
  },

  verifyToken: async (token: string): Promise<{ valid: boolean }> => {
    return apiClient.get<{ valid: boolean }>(`/auth/verify?token=${token}`);
  },

  refreshToken: async (): Promise<{ token: string }> => {
    return apiClient.post<{ token: string }>("/auth/refresh");
  },
};
