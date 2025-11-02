import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import axios from 'axios';

// Types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profile: {
    avatar?: string;
    favoriteGenres: string[];
    languagePreference: string;
    parentalControls: {
      enabled: boolean;
      maxRating: string;
      pin: string;
    };
  };
  subscription: {
    status: 'active' | 'inactive' | 'cancelled' | 'past_due';
    plan?: string;
    stripeCustomerId?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd: boolean;
  };
  role: 'user' | 'admin';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Axios instance for authenticated requests
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for httpOnly cookies
});

// Request interceptor to add access token to headers
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
          withCredentials: true,
        });

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout the user
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      const response = await api.get('/auth/me');
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('accessToken');
      setError('Session expired. Please log in again.');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { user, accessToken } = response.data.data;

      // Store access token
      localStorage.setItem('accessToken', accessToken);
      setUser(user);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/auth/register`, userData);

      const { user, accessToken } = response.data.data;

      // Store access token
      localStorage.setItem('accessToken', accessToken);
      setUser(user);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local data
      localStorage.removeItem('accessToken');
      setUser(null);
      setError(null);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
        withCredentials: true,
      });

      const { accessToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { api };