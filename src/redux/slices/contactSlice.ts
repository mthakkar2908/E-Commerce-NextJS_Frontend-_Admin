/* eslint-disable @typescript-eslint/no-explicit-any */
import { authApi } from "@/src/api/endpoints";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

export const getAllContacts = createAsyncThunk(
  "contacts/getAllContacts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.contactForm();
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

const contactSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default contactSlice.reducer;
