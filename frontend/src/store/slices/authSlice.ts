import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { userApi, type LoginCredentials, type RegisterData, type UpdateProfileData, type ChangePasswordData, type User } from "../../api/users";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const login = createAsyncThunk("auth/login", async (credentials: LoginCredentials, { rejectWithValue }) => {
  try {
    const response = await userApi.login(credentials);
    localStorage.setItem("token", response.token);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const register = createAsyncThunk("auth/register", async (userData: RegisterData, { rejectWithValue }) => {
  try {
    const response = await userApi.register(userData);
    localStorage.setItem("token", response.token);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Registration failed");
  }
});

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token found");
    }
    const user = await userApi.getCurrentUser(token);
    return { user, token };
  } catch (error: any) {
    localStorage.removeItem("token");
    return rejectWithValue(error.response?.data?.message || "Authentication failed");
  }
});

export const updateProfile = createAsyncThunk("auth/updateProfile", async (data: UpdateProfileData, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState() as { auth: AuthState };
    if (!auth.token) return rejectWithValue("Not authenticated");

    const response = await userApi.updateProfile(auth.token, data);
    return response.user;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Profile update failed");
  }
});

export const changePassword = createAsyncThunk("auth/changePassword", async (data: ChangePasswordData, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState() as { auth: AuthState };
    if (!auth.token) return rejectWithValue("Not authenticated");

    const response = await userApi.changePassword(auth.token, data);
    return response.message;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Password change failed");
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        toast.success("Logged in successfully");
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        toast.success("Registered successfully");
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        toast.success("Profile updated successfully");
      })
      .addCase(updateProfile.rejected, (state, action) => {
        toast.error(action.payload as string);
      })

      .addCase(changePassword.fulfilled, (state, action) => {
        toast.success("Password changed successfully");
      })
      .addCase(changePassword.rejected, (state, action) => {
        toast.error(action.payload as string);
      })

      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        toast.success("Logged out successfully");
      });
  },
});

export default authSlice.reducer;
