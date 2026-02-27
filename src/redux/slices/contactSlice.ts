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

export const searchContacts = createAsyncThunk(
  "contacts/searchContact",
  async (q: string, { rejectWithValue }) => {
    try {
      const response = await authApi.searchContacts(q);
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
