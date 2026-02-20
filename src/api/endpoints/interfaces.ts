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
