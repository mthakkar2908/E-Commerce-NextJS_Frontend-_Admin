/* eslint-disable @typescript-eslint/no-explicit-any */
import { authApi } from "@/src/api/endpoints";
import {
  AddQuantityPayload,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/src/api/endpoints/interfaces";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async (data: { page?: number; pageSize?: number }, { rejectWithValue }) => {
    try {
      const res = await authApi.getProducts(data.page, data.pageSize);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? "Failed to fetch products");
    }
  },
);

export const getProductsByCatId = createAsyncThunk(
  "products/getAllProducts",
  async (cat_id: string, { rejectWithValue }) => {
    try {
      const res = await authApi.getProductsByCategoryId(cat_id);
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error?.message ?? "Failed to fetch Products By category id",
      );
    }
  },
);

export const UpdateProductQuantity = createAsyncThunk(
  "products/UpdateProductQuantity",
  async (data: AddQuantityPayload, { rejectWithValue }) => {
    try {
      const res = await authApi.addQuantity(data);
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error.message ?? "Failed to update product quantity",
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

export const CreateProduct = createAsyncThunk(
  "products/CreateProduct",
  async (data: CreateProductRequest, { rejectWithValue }) => {
    try {
      const res = await authApi.createProduct(data);
      return res;
    } catch (error) {
      return rejectWithValue(
        (error as any)?.response?.message ?? "Failed to create product",
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

export const UpdateProducts = createAsyncThunk(
  "products/UpdateProducts",
  async (data: UpdateProductRequest, { rejectWithValue }) => {
    try {
      const res = await authApi.updateProduct(data);
      return res;
    } catch (error: any) {
      return rejectWithValue(error?.message ?? "Failed to update order.");
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
