import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

const setAuthHeader = (token: string) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const userApi = {
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/users/login`, credentials);
    return response.data;
  },

  getCurrentUser: async (token: string): Promise<User> => {
    const response = await axios.get(`${API_URL}/users/me`, setAuthHeader(token));
    return response.data;
  },

  updateProfile: async (token: string, data: UpdateProfileData): Promise<{ message: string; user: User }> => {
    const response = await axios.put(`${API_URL}/users/profile`, data, setAuthHeader(token));
    return response.data;
  },

  changePassword: async (token: string, data: ChangePasswordData): Promise<{ message: string }> => {
    const response = await axios.put(`${API_URL}/users/password`, data, setAuthHeader(token));
    return response.data;
  },
};
