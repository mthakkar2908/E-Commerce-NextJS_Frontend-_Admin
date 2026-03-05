/* eslint-disable @typescript-eslint/no-explicit-any */
import { authApi } from "@/src/api/endpoints";
import {
  AddCategoryRequest,
  updateCategoryRequest,
} from "@/src/api/endpoints/interfaces";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

export const GetCategories = createAsyncThunk(
  "category/GetCategories",
  async (params: { page?: number; pageSize?: number }, { rejectWithValue }) => {
    try {
      const response = await authApi.getCategories(
        params.page,
        params.pageSize,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch categories data",
      );
    }
  },
);

export const getAllCategory = createAsyncThunk(
  "category/getAllCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getAllCategories();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch categories data",
      );
    }
  },
);

export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (formData: AddCategoryRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.addCategory(formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add category",
      );
    }
  },
);

export const UpdateCategory = createAsyncThunk(
  "category/UpdateCategory",
  async (formData: updateCategoryRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.updateCategory(formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update category",
      );
    }
  },
);

export const deleteCategories = createAsyncThunk(
  "category/deleteCategories",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await authApi.deleteCategory(id);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to delete category");
    }
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
});

export default categorySlice.reducer;
