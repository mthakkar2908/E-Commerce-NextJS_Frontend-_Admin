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
