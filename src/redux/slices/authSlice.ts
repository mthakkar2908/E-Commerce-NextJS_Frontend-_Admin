import { authApi, LoginRequest } from "@/src/api/endpoints";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export interface User {
  id?: string;
  email: string;
  name?: string;
  role?: string;
  token?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token?: string;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: undefined,
};

export const loginThunk = createAsyncThunk<
  User,
  LoginRequest,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.login(credentials);
    if (response.admin) {
      return response.admin;
    }
    return rejectWithValue(response.message || "Login failed");
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An error occurred during login");
  }
});

export const logoutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/logout", async (_, {}) => {
  try {
    await authApi.logout();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Logout error:", error);
    }
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        state.token = action.payload?.token;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
        state.user = null;
      });

    builder
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.token = undefined;
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = undefined;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;

export default authSlice.reducer;
