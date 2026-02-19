/* eslint-disable @typescript-eslint/no-explicit-any */
import { authApi } from "@/src/api/endpoints";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getProducts();
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.message ?? "Failed to fetch products",
      );
    }
  },
);

export const searchProductsByQuery = createAsyncThunk(
  "product/searchProductsByQuery",
  async (query: string, { rejectWithValue }) => {
    try {
      const resp = await authApi.searchProducts(query);
      return resp;
    } catch {
      return rejectWithValue("failed to search products.");
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "users/deleteProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await authApi.deleteProducts(id);
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.message ?? "Failed to delete Product",
      );
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default productSlice.reducer;
