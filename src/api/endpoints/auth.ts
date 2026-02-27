import { apiClient } from "../client";
import {
  AddPostRequest,
  AddPostResponse,
  AddQuantityPayload,
  AddQuantityResponse,
  AddToCartPayload,
  AddToCartResponse,
  ContactDeletedResponse,
  ContactFormResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  CreateProductRequest,
  createProductResponse,
  DeletePostsResponse,
  DeletePrivacyResponse,
  DeleteProductResponse,
  DeleteTermsResponse,
  DeleteUserResponse,
  GetAllPostResponse,
  GetAllProductsResponse,
  GetAllSubscriberData,
  getOrdersResponse,
  getPrivacyText,
  getTermsText,
  getUsersResponse,
  InviteUserRequest,
  InviteUsersResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  PrivacyPolicyResponse,
  RegisterRequest,
  RegisterResponse,
  SearchContactResponse,
  SearchProductResponse,
  TermsConditionResponse,
  TotalCountResponse,
  UnSubscribeChannel,
  UnsubscribeChannelRequest,
  UpdateProductRequest,
  UpdateProductResponse,
} from "./interfaces";

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

  logout: async (email: string): Promise<LogoutResponse> => {
    return apiClient.post<LogoutResponse>("/admin/logout", { email });
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
  getProducts: async (
    page?: number,
    pageSize?: number,
  ): Promise<GetAllProductsResponse> => {
    return apiClient.get<GetAllProductsResponse>(
      `/products?page=${page}&pageSize=${pageSize}`,
    );
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
  getOrders: async (): Promise<getOrdersResponse[]> => {
    return apiClient.get<getOrdersResponse[]>("/orders");
  },
  searchOrders: async (o: string): Promise<getOrdersResponse[]> => {
    return apiClient.get<getOrdersResponse[]>(`/orders/searchOrders?o=${o}`);
  },
  deleteOrder: async (id: string) => {
    return apiClient.delete(`/orders/deleteOrder/${id}`);
  },
  contactForm: async (): Promise<ContactFormResponse[]> => {
    return apiClient.get<ContactFormResponse[]>("/contact/form");
  },
  deleteContact: async (id: string): Promise<ContactDeletedResponse> => {
    return apiClient.delete<ContactDeletedResponse>(
      `/contact/deleteContact/${id}`,
    );
  },
  createProduct: async (
    data: CreateProductRequest,
  ): Promise<createProductResponse> => {
    return apiClient.post<createProductResponse>(
      `/products/createProduct`,
      data,
    );
  },
  addToCart: async (
    userId: string,
    data: AddToCartPayload,
  ): Promise<AddToCartResponse> => {
    return apiClient.post<AddToCartResponse>(`/cart/${userId}/add`, data);
  },

  addQuantity: async (
    data: AddQuantityPayload,
  ): Promise<AddQuantityResponse> => {
    return apiClient.put<AddQuantityResponse>("/products/addQuan", data);
  },

  searchContacts: async (q: string): Promise<SearchContactResponse[]> => {
    return apiClient.get<SearchContactResponse[]>(`/contact/search?q=${q}`);
  },
  createOrder: async (
    data: CreateOrderRequest,
  ): Promise<CreateOrderResponse> => {
    return apiClient.post<CreateOrderResponse>("/orders/createOrder", data);
  },
  createPost: async (data: AddPostRequest): Promise<AddPostResponse> => {
    return apiClient.post<AddPostResponse>("/posts", data);
  },
  updateProduct: async (
    data: UpdateProductRequest,
  ): Promise<UpdateProductResponse> => {
    return apiClient.put<UpdateProductResponse>(
      "/products/updateProduct",
      data,
    );
  },
};
