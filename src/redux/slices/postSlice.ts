/* eslint-disable @typescript-eslint/no-explicit-any */
import { authApi } from "@/src/api/endpoints";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

export const getAllPosts = createAsyncThunk(
  "posts/getAllPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getPosts();
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.message ?? "Failed to fetch posts",
      );
    }
  },
);

export const getSubscriberData = createAsyncThunk(
  "posts/getSubscriberData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getSubscriberData();
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.message ?? "Failed to fetch Subscriber Data",
      );
    }
  },
);

export const deletePost = createAsyncThunk(
  "users/deletePost",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await authApi.deletePost(id);
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.message ?? "Failed to delete Post",
      );
    }
  },
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default postSlice.reducer;
