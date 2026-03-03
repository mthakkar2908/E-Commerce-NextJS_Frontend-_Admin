/* eslint-disable @typescript-eslint/no-explicit-any */
import { authApi } from "@/src/api/endpoints";
import {
  AddToCartPayload,
  AddToCartResponse,
  CreateOrderRequest,
} from "@/src/api/endpoints/interfaces";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

export const getAllOrders = createAsyncThunk(
  "orders/getAllOrders",
  async (params: { page: number; pageSize: number }, { rejectWithValue }) => {
    try {
      const res = await authApi.getOrders(params.page, params.pageSize);
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.message ?? "Failed to fetch orders",
      );
    }
  },
);

export const CreateOrder = createAsyncThunk(
  "orders/CreateOrder",
  async (data: CreateOrderRequest, { rejectWithValue }) => {
    try {
      const res = await authApi.createOrder(data);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? "Failed to create Order");
    }
  },
);

export const getAllOrdersBySearch = createAsyncThunk(
  "orders/getAllOrdersBySearch",
  async (
    params: { o: string; page: number; pageSize: number },
    { rejectWithValue },
  ) => {
    try {
      const res = await authApi.searchOrders(
        params.o,
        params.page,
        params.pageSize,
      );
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.message ?? "Failed to fetch orders",
      );
    }
  },
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await authApi.deleteOrder(id);
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.message ?? "Failed to delete an order",
      );
    }
  },
);

export const addToCart = createAsyncThunk<
  AddToCartResponse,
  { userId: string; data: AddToCartPayload },
  { rejectValue: string }
>("orders/addToCart", async ({ userId, data }, { rejectWithValue }) => {
  try {
    const res = await authApi.addToCart(userId, data);
    return res;
  } catch (error: any) {
    return rejectWithValue(error?.message ?? "Failed to add to cart");
  }
});
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
});

export default orderSlice.reducer;
