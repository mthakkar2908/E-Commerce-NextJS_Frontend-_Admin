import { apiClient } from "../client";
import {
  AddPostRequest,
  AddPostResponse,
  AddQuantityPayload,
  AddQuantityResponse,
  AddToCartPayload,
  AddToCartResponse,
  ContactDeletedResponse,
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
  GetSubscribersList,
  getAllOrdersResponse,
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
  ContactListResponse,
  SearchProductResponse,
  TermsConditionResponse,
  TotalCountResponse,
  UnSubscribeChannel,
  UnsubscribeChannelRequest,
  updateContactRequest,
  updateContactResponse,
  updatePostRequest,
  updatePostResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  AddCategoryRequest,
  AddCategoryResponse,
  GetCategoryFullResponse,
  deleteCategoryResponse,
  updateCategoryRequest,
  updateCategoryResponse,
  getProducutsByCategoryId,
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
  getSubscriberData: async (
    page?: number,
    pageSize?: number,
  ): Promise<GetSubscribersList> => {
    return apiClient.get<GetSubscribersList>(
      `/email-signup?page=${page ?? 1}&pageSize=${pageSize ?? 10}`,
    );
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
  getOrders: async (
    page?: number,
    pageSize?: number,
  ): Promise<getAllOrdersResponse> => {
    return apiClient.get<getAllOrdersResponse>(
      `/orders?page=${page ?? 1}&pageSize=${pageSize ?? 10}`,
    );
  },
  searchOrders: async (
    o: string,
    page?: number,
    pageSize?: number,
  ): Promise<getAllOrdersResponse> => {
    return apiClient.get<getAllOrdersResponse>(
      `/orders/searchOrders?o=${o}&page=${page ?? 1}&pageSize=${pageSize ?? 10}`,
    );
  },
  deleteOrder: async (id: string) => {
    return apiClient.delete(`/orders/deleteOrder/${id}`);
  },
  contactForm: async (
    page?: number,
    pageSize?: number,
  ): Promise<ContactListResponse> => {
    return apiClient.get<ContactListResponse>(
      `/contact/form?page=${page ?? 1}&pageSize=${pageSize ?? 10}`,
    );
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

  searchContacts: async (
    q: string,
    page?: number,
    pageSize?: number,
  ): Promise<ContactListResponse> => {
    return apiClient.get<ContactListResponse>(
      `/contact/search?q=${encodeURIComponent(q)}&page=${page ?? 1}&pageSize=${pageSize ?? 10}`,
    );
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
  updateContact: async (
    data: updateContactRequest,
  ): Promise<updateContactResponse> => {
    return apiClient.put<updateContactResponse>("/contact/updateContact", data);
  },
  updatePost: async (
    data: updatePostRequest,
    postId: string,
  ): Promise<updatePostResponse> => {
    return apiClient.post<updatePostResponse>(
      `/posts/updatePost/${postId}`,
      data,
    );
  },
  addCategory: async (
    data: AddCategoryRequest,
  ): Promise<AddCategoryResponse> => {
    return apiClient.post<AddCategoryResponse>(`/category`, data);
  },
  getCategories: async (
    page?: number,
    pageSize?: number,
  ): Promise<GetCategoryFullResponse> => {
    return apiClient.get<GetCategoryFullResponse>(
      `/category/getCategory?page=${page}&pageSize=${pageSize}`,
    );
  },
  deleteCategory: async (id: string): Promise<deleteCategoryResponse> => {
    return apiClient.delete<deleteCategoryResponse>(
      `/category/deleteCategory/${id}`,
    );
  },
  updateCategory: async (
    data: updateCategoryRequest,
  ): Promise<updateCategoryResponse> => {
    return apiClient.post<updateCategoryResponse>(
      `/category/updateCategory`,
      data,
    );
  },
  getAllCategories: async (): Promise<updateCategoryResponse[]> => {
    return apiClient.get<updateCategoryResponse[]>(
      `/category/getAllCategories`,
    );
  },
  getProductsByCategoryId: async (
    cat_id: string,
  ): Promise<getProducutsByCategoryId[]> => {
    return apiClient.get<getProducutsByCategoryId[]>(
      `/products/category/${cat_id}`,
    );
  },
};
