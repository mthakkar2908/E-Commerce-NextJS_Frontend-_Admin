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

export const getPrivacyText = createAsyncThunk(
  "privacy/getPrivacyText",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getPrivacyText();
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.message ?? `Can't get privacy data`,
      );
    }
  },
);

export const getTermsText = createAsyncThunk(
  "terms/getTermsText",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getTermsText();
      return res;
    } catch (error: any) {
      return rejectWithValue(error.response?.message ?? `Can't get terms data`);
    }
  },
);

export const AddOrUpdatePrivacy = createAsyncThunk(
  "privacy/AddOrUpdatePrivacy",
  async (PrivacyPolicyText: string, { rejectWithValue }) => {
    try {
      const res = await authApi.addorUpdatePrivacyPolicy(PrivacyPolicyText);
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.message ?? `Can't Add or update Privacy Policy Text`,
      );
    }
  },
);

export const AddOrUpdateTerms = createAsyncThunk(
  "terms/AddOrUpdateTerms",
  async (TermsConditionsText: string, { rejectWithValue }) => {
    try {
      const res = await authApi.addorUpdateTermsCondition(TermsConditionsText);
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.message ??
          `Can't Add or update Terms & Conditions Text`,
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

export const deletePrivacy = createAsyncThunk(
  "privacy/deletePrivacy",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await authApi.deletePrivacy(id);
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.message ?? "Failed to delete Privacy policy",
      );
    }
  },
);

export const deleteTerms = createAsyncThunk(
  "terms/deleteTerms",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await authApi.deleteTerms(id);
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.message ?? "Failed to delete Terms & Condition",
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
