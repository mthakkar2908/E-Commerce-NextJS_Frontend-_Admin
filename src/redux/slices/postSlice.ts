/* eslint-disable @typescript-eslint/no-explicit-any */
import { authApi } from "@/src/api/endpoints";
import {
  AddPostRequest,
  InviteUserRequest,
  UnsubscribeChannelRequest,
} from "@/src/api/endpoints/interfaces";
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
  "subscribe/getSubscriberData",
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

export const unSubscribeChannel = createAsyncThunk(
  "subscribe/unSubscribeChannel",
  async (payload: UnsubscribeChannelRequest, { rejectWithValue }) => {
    try {
      const res = await authApi.unSubscribeChannel(payload);
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.message ?? "Failed to unsubscribe channel",
      );
    }
  },
);

export const InvitePeopleForAdmin = createAsyncThunk(
  "subscribe/InvitePeoples",
  async (payload: InviteUserRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.InvitePeoples(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? "Failed to invite Peoples");
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

export const addPost = createAsyncThunk(
  "posts/addPost",
  async (formData: AddPostRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.createPost(formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add post",
      );
    }
  },
);
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
});

export default postSlice.reducer;
