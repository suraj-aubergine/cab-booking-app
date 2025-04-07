import axios from "axios";
import { API_URL } from "@/lib/constants";
import { LoginFormValues, RegisterFormValues } from "@/lib/validations/auth";

interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export const authService = {
  async login(data: LoginFormValues): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as AuthResponse;
      }
      throw error;
    }
  },

  async register(data: RegisterFormValues): Promise<AuthResponse> {
    try {
      // Remove confirmPassword as it's not needed in the API request
      const { confirmPassword, ...registerData } = data;
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, registerData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as AuthResponse;
      }
      throw error;
    }
  },

  async logout(): Promise<void> {
    // If your API has a logout endpoint, call it here
    // await axios.post(`${API_URL}/auth/logout`);
    // For now, we'll just handle it client-side
  }
}; 