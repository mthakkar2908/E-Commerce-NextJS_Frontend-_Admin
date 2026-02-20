import { apiClient } from "../client";
import {
  DeletePostsResponse,
  DeletePrivacyResponse,
  DeleteProductResponse,
  DeleteTermsResponse,
  DeleteUserResponse,
  GetAllPostResponse,
  GetAllProductsResponse,
  GetAllSubscriberData,
  getPrivacyText,
  getTermsText,
  getUsersResponse,
  InviteUserRequest,
  InviteUsersResponse,
  PrivacyPolicyResponse,
  SearchProductResponse,
  TermsConditionResponse,
  UnSubscribeChannel,
  UnsubscribeChannelRequest,
} from "./interfaces";

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

  getUsers: async (): Promise<getUsersResponse> => {
    return apiClient.get<getUsersResponse>("/users");
  },
  deleteUser: async (id: string): Promise<DeleteUserResponse> => {
    return apiClient.delete<DeleteUserResponse>(`/users/${id}`);
  },
  getProducts: async (): Promise<GetAllProductsResponse> => {
    return apiClient.get<GetAllProductsResponse>("/products");
  },
  searchProducts: async (query: string): Promise<SearchProductResponse> => {
    return apiClient.get<SearchProductResponse>(
      `/products/searchProducts?q=${query}`,
    );
  },
  deleteProducts: async (id: string): Promise<DeleteProductResponse> => {
    return apiClient.delete<DeleteProductResponse>(`/products/${id}`);
  },
  getPosts: async (): Promise<GetAllPostResponse[]> => {
    return apiClient.get<GetAllPostResponse[]>("/posts");
  },
  deletePost: async (id: string): Promise<DeletePostsResponse> => {
    return apiClient.delete<DeletePostsResponse>(`/posts/deletePost/${id}`);
  },
  getSubscriberData: async (): Promise<GetAllSubscriberData[]> => {
    return apiClient.get<GetAllSubscriberData[]>(`/email-signup`);
  },
  unSubscribeChannel: async (
    data: UnsubscribeChannelRequest,
  ): Promise<UnSubscribeChannel> => {
    return apiClient.delete<UnSubscribeChannel>(
      "/email-signup/unSubscribe",
      data,
    );
  },
  InvitePeoples: async (
    data: InviteUserRequest,
  ): Promise<InviteUsersResponse> => {
    return apiClient.post<InviteUsersResponse>(
      "/email-signup?type=invite",
      data,
    );
  },
  getPrivacyText: async (): Promise<getPrivacyText[]> => {
    return apiClient.get<getPrivacyText[]>(`/privacy-policy/getText`);
  },
  addorUpdatePrivacyPolicy: async (
    PrivacyPolicyText: string,
  ): Promise<PrivacyPolicyResponse> => {
    return apiClient.post<PrivacyPolicyResponse>(`/privacy-policy`, {
      PrivacyPolicyText,
    });
  },
  deletePrivacy: async (id: string): Promise<DeletePrivacyResponse> => {
    return apiClient.delete<DeletePrivacyResponse>(
      `/privacy-policy/delete-privacy/${id}`,
    );
  },
  getTermsText: async (): Promise<getTermsText[]> => {
    return apiClient.get<getTermsText[]>(`/terms-conditions/getText`);
  },
  addorUpdateTermsCondition: async (
    TermsConditionsText: string,
  ): Promise<TermsConditionResponse> => {
    return apiClient.post<TermsConditionResponse>(`/terms-conditions`, {
      TermsConditionsText,
    });
  },
  deleteTerms: async (id: string): Promise<DeleteTermsResponse> => {
    return apiClient.delete<DeleteTermsResponse>(
      `/terms-conditions/delete-terms/${id}`,
    );
  },
};
