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

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default productSlice.reducer;
