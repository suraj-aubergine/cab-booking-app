import { useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { User } from '@/types/auth';
import { useNavigate } from 'react-router-dom';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthResponse {
  data: {
    token: string;
    user: User;
  };
}

export function useAuth() {
  const { setAuth, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { token, user } = response.data.data;
      
      if (!token || !user) {
        throw new Error('Invalid response format');
      }

      console.log('Login successful:', { token, user }); // Debug log
      setAuth(token, user);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, [setAuth]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await api.post('/auth/register', data);
      return response.data.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    navigate('/login', { replace: true });
  }, [clearAuth, navigate]);

  return { login, register, logout };
} 