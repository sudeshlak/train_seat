import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../../types/auth";
import { authService } from "../../services/authService";
import { getApiError, ErrorType } from "../../api/errors";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  globalError: {
    type: ErrorType | null;
    message: string | null;
  } | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  globalError: null,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await authService.login(email, password);
      return data;
    } catch (error) {
      const apiError = getApiError(error);
      if (apiError.type === ErrorType.UNAUTHENTICATED) {
        // Let the component handle redirect
        return rejectWithValue({
          type: ErrorType.UNAUTHENTICATED,
          message: apiError.message,
        } as const);
      }
      if (apiError.type === ErrorType.VALIDATION) {
        return rejectWithValue({
          type: ErrorType.VALIDATION,
          message: apiError.message,
        } as const);
      }
      // Network or server errors - set global error
      return rejectWithValue({
        type: apiError.type,
        message: apiError.message,
      } as const);
    }
  }
);

export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (
    {
      email,
      password,
      confirmPassword,
    }: { email: string; password: string; confirmPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await authService.signup(email, password, confirmPassword);
      return data;
    } catch (error) {
      const apiError = getApiError(error);
      if (apiError.type === ErrorType.UNAUTHENTICATED) {
        return rejectWithValue({
          type: ErrorType.UNAUTHENTICATED,
          message: apiError.message,
        } as const);
      }
      if (apiError.type === ErrorType.VALIDATION) {
        return rejectWithValue({
          type: ErrorType.VALIDATION,
          message: apiError.message,
        } as const);
      }
      return rejectWithValue({
        type: apiError.type,
        message: apiError.message,
      } as const);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      authService.logout();
    },
    clearError(state) {
      state.error = null;
    },
    clearGlobalError(state) {
      state.globalError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.globalError = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.globalError = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        if (payload) {
          if (payload.type === ErrorType.VALIDATION) {
            state.error = payload.message;
          } else {
            state.globalError = payload;
          }
        } else {
          state.globalError = {
            type: ErrorType.UNKNOWN,
            message: "Login failed",
          };
        }
      })
      // Signup
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.globalError = null;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.globalError = null;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        if (payload) {
          if (payload.type === ErrorType.VALIDATION) {
            state.error = payload.message;
          } else {
            state.globalError = payload;
          }
        } else {
          state.globalError = {
            type: ErrorType.UNKNOWN,
            message: "Signup failed",
          };
        }
      });
  },
});

export const { setCredentials, logout, clearError, clearGlobalError } =
  authSlice.actions;
export default authSlice.reducer;
