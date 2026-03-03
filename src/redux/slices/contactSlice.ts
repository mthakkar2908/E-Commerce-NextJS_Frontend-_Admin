/* eslint-disable @typescript-eslint/no-explicit-any */
import { authApi } from "@/src/api/endpoints";
import { updateContactRequest } from "@/src/api/endpoints/interfaces";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

export const getAllContacts = createAsyncThunk(
  "contacts/getAllContacts",
  async (
    params: { page?: number; pageSize?: number } = { page: 1, pageSize: 10 },
    { rejectWithValue },
  ) => {
    try {
      const res = await authApi.contactForm(params.page, params.pageSize);
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.message ?? "Failed to fetch contact forms data",
      );
    }
  },
);

export const deleteConact = createAsyncThunk(
  "contacts/deleteContact",
  async (id: string, { rejectWithValue }) => {
    try {
      const deletedContact = await authApi.deleteContact(id);
      return deletedContact;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.message ?? "Failed to delete contact",
      );
    }
  },
);

export const searchContacts = createAsyncThunk(
  "contacts/searchContact",
  async (
    params: { q: string; page?: number; pageSize?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await authApi.searchContacts(
        params.q,
        params.page,
        params.pageSize,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? "Faild to search contact");
    }
  },
);

export const UpdateContact = createAsyncThunk(
  "contacts/UpdateContact",
  async (data: updateContactRequest, { rejectWithValue }) => {
    try {
      const res = await authApi.updateContact(data);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? "Failed to update product");
    }
  },
);

const contactSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
});

export default contactSlice.reducer;
