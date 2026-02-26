/* eslint-disable @typescript-eslint/no-explicit-any */
import { authApi } from "@/src/api/endpoints";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface TotalCountState {
  totalPosts: number;
  totalProducts: number;
  totalUsers: number;
  totalOrders?: number;
  totalContactForms: number;
  loading: boolean;
  error: string | null;
  lastUserAdded: string;
  lastOrderAdded: string;
  lastPostAdded: string;
  lastContactAdded: string;
  lastProductAdded: string;
}

const initialState: TotalCountState = {
  totalPosts: 0,
  totalProducts: 0,
  totalUsers: 0,
  totalOrders: 0,
  totalContactForms: 0,
  lastContactAdded: "",
  lastOrderAdded: "",
  lastPostAdded: "",
  lastProductAdded: "",
  lastUserAdded: "",
  loading: false,
  error: null,
};

export const fetchCounts = createAsyncThunk<
  {
    totalPosts: number;
    totalProducts: number;
    totalUsers: number;
    totalOrders: number;
    totalContactForms: number;
    lastUserAdded: string;
    lastOrderAdded: string;
    lastPostAdded: string;
    lastContactAdded: string;
    lastProductAdded: string;
  },
  void,
  { rejectValue: string }
>("count/fetchCounts", async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.totalCount();

    return {
      totalPosts: response.totalPosts,
      totalProducts: response.totalProducts,
      totalUsers: response.totalUsers,
      totalOrders: response.totalOrders,
      totalContactForms: response.totalContactForms,
      lastUserAdded: response.lastUserAdded,
      lastOrderAdded: response.lastOrderAdded,
      lastPostAdded: response.lastPostAdded,
      lastContactAdded: response.lastContactAdded,
      lastProductAdded: response.lastProductAdded,
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch counts",
    );
  }
});

export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getUsers();
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.message ?? "Failed to fetch Users",
      );
    }
  },
);

export const deleteUsers = createAsyncThunk(
  "users/deleteUsers",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await authApi.deleteUser(id);
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.message ?? "Failed to delete User",
      );
    }
  },
);

const countSlice = createSlice({
  name: "count",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCounts.fulfilled, (state, action) => {
        state.loading = false;
        state.totalPosts = action.payload.totalPosts;
        state.totalProducts = action.payload.totalProducts;
        state.totalUsers = action.payload.totalUsers;
        state.totalOrders = action.payload.totalOrders;
        state.totalContactForms = action.payload.totalContactForms;
        state.lastUserAdded = action.payload.lastUserAdded;
        state.lastContactAdded = action.payload.lastContactAdded;
        state.lastOrderAdded = action.payload.lastOrderAdded;
        state.lastPostAdded = action.payload.lastPostAdded;
        state.lastProductAdded = action.payload.lastProductAdded;
      })
      .addCase(fetchCounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default countSlice.reducer;
