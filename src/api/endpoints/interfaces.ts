export interface getUsersResponse {
  _id: string;
  name: string;
  email: string;
  profile_image: string;
}

export interface DeleteUserResponse {
  message: string;
}

export interface GetAllProductsResponse {
  data: {
    order: number;
    _id: string;
    name: string;
    about_product: string;
    price: number;
    quan: number;
  };
  total: number;
  page: number;
  pageSize: number;
}
export interface SearchProductResponse {
  order: number;
  _id: string;
  name: string;
  about_product: string;
  price: number;
  quan: number;
}

export interface DeleteProductResponse {
  message: string;
  deleteProduct: {
    _id: string;
    name: string;
    about_product: string;
    price: number;
    quan: number;
    is_fav: boolean;
  };
}

export interface GetAllPostResponse {
  _id: string;
  name: string;
  post_description: string;
  email: string;
  imageUrl: string;
  user: {
    _id: string;
    name: string;
    email: string;
    profile_image: string;
  };
}

export interface DeletePostsResponse {
  message: string;
  data: {
    _id: string;
    name: string;
    post_description: string;
    email: string;
    imageUrl: string;
  };
}

export interface GetAllSubscriberData {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    profile_image: string;
  };
  email: string;
}

export interface GetSubscribersList {
  data: GetAllSubscriberData[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UnSubscribeChannel {
  message: string;
  data: {
    acknowledged: string;
    deletedCount: number;
  };
}

export interface UnsubscribeChannelRequest {
  userId: string;
  email: string;
}

export interface InviteUsersResponse {
  message: string;
  data?: {
    userId: string;
    email: string;
    _id: string;
  };
}

export interface InviteUserRequest {
  userId: string;
  email: string;
}

export interface getPrivacyText {
  _id: string;
  PrivacyPolicyText: string;
}

export interface PrivacyPolicyResponse {
  message: string;
  data: {
    _id: string;
    PrivacyPolicyText: string;
  };
}

export interface DeletePrivacyResponse {
  message: string;
  deletedPrivacy: {
    _id: string;
    PrivacyPolicyText: string;
  };
}

export interface getTermsText {
  _id: string;
  TermsConditionsText: string;
}

export interface TermsConditionResponse {
  message: string;
  data: {
    _id: string;
    TermsConditionsText: string;
  };
}

export interface DeleteTermsResponse {
  message: string;
  deletedTerms: {
    _id: string;
    TermsConditionsText: string;
  };
}

export interface getOrdersResponse {
  _id: string;
  product_id: {
    _id: string;
    name: string;
    about_product: string;
    price: number;
    quan: number;
  };
  user_id: string;
  user_first_name: string;
  user_last_name: string;
  product_name: string;
  email: string;
  status: string;
  address: string;
  mobile_no: number;
  total_price: number;
  product_quan: number;
}

export interface ContactFormResponse {
  _id: string;
  name: string;
  email: string;
  title: string;
  mobile_no: string;
  description: string;
}

export interface ContactListResponse {
  data: ContactFormResponse[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ContactDeletedResponse {
  message: string;
  deletedContact: {
    _id: string;
    name: string;
    email: string;
    title: string;
    mobile_no: string;
    description: string;
  };
}

export interface CreateProductRequest {
  name: string;
  about_product: string;
  price: number;
  quan: number;
}

export interface createProductResponse {
  statusCode: number;
  message: string;
  data: {
    name: string;
    about_product: string;
    price: number;
    qua: number;
    _id: string;
  };
}
export interface AddToCartPayload {
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface AddToCartResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    userId: string;
    items: {
      productId: string;
      quantity: number;
      _id: string;
    }[];
    createdAt: string;
    updatedAt: string;
  };
}

export interface AddQuantityPayload {
  productId: string;
  quantity: number;
}

export interface AddQuantityResponse {
  message: string;
}

export interface SearchContactResponse {
  _id: string;
  name: string;
  email: string;
  title: string;
  mobile_no: string;
  description: string;
}

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
  totalOrders: number;
  totalContactForms: number;
  lastUserAdded: string;
  lastOrderAdded: string;
  lastPostAdded: string;
  lastContactAdded: string;
  lastProductAdded: string;
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
  message: string;
}

export interface CreateOrderRequest {
  product_id: string;
  user_id: string;
  user_first_name: string;
  user_last_name: string;
  product_name: string;
  email: string;
  status: string;
  address: string;
  mobile_no: number;
  total_price: number;
  product_quan: number;
}

export interface CreateOrderResponse {
  statusCode: number;
  message: string;
  data: {
    product_id: string;
    user_id: string;
    user_first_name: string;
    user_last_name: string;
    product_name: string;
    email: string;
    status: string;
    address: string;
    mobile_no: number;
    total_price: number;
    product_quan: number;
    _id: number;
  };
}

export interface AddPostRequest {
  userId: string;
  name: string;
  post_description: string;
  email: string;
  image: File;
}

export interface AddPostResponse {
  _id: string;
  name: string;
  post_description: string;
  email: string;
  imageUrl: string | null;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}
export interface UpdateProductRequest {
  id: string;
  name: string;
  about_product: string;
  price: number;
  quan: number;
}

export interface UpdateProductResponse {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    name: string;
    about_product: string;
    price: number;
    quan: number;
  };
}

export interface updateContactRequest {
  id: string;
  name: string;
  email: string;
  title: string;
  mobile_no: string;
  description: string;
}

export interface updateContactResponse {
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    title: string;
    mobile_no: string;
    description: string;
  };
}

export interface updatePostResponse {
  _id: string;
  name: string;
  post_description: string;
  email: string;
  imageUrl: string;
  user: string;
  admin: string;
}

export interface updatePostRequest {
  userId: string;
  name: string;
  post_descripton: string;
  email: string;
  image: File;
}
