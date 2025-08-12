import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api";
import { toast } from "sonner";

interface User {
  isAdmin: boolean;
  id: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  stripePublishableKey: string | null;
  initializeAuth: () => void;
  register: (userData: any) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || null,

      initializeAuth: () => {
        const { token } = get();
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/api/auth/register", userData);
          const { token, userId, ...restUserData } = response.data;

          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          set({
            user: {
              id: userId,
              email: userData.email,
              ...restUserData,
            },
            token,
            isLoading: false,
          });
          toast.success("Registration successful!");
        } catch (error: any) {
          set({
            error:
              error.response?.data?.error?.message || "Registration failed",
            isLoading: false,
          });
          toast.error(
            error.response?.data?.error?.message || "Registration failed"
          );
          throw error;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/api/auth/login", {
            email,
            password,
          });
          const { token, userId, ...userData } = response.data;

          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          set({
            user: {
              id: userId,
              email,
              ...userData,
            },
            token,
            isLoading: false,
          });
          toast.success("Logged in successfully!");
        } catch (error: any) {
          set({
            error: error.response?.data?.error?.message || "Login failed",
            isLoading: false,
          });
          toast.error(error.response?.data?.error?.message || "Login failed");
          throw error;
        }
      },

      logout: () => {
        delete api.defaults.headers.common["Authorization"];
        set({ user: null, token: null, isLoading: false, error: null });
        toast.info("Logged out successfully.");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ...state,
        isLoading: false,
        error: null,
      }),
      version: 1,
      onRehydrateStorage: (state) => {
        if (state && state.token) {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${state.token}`;
        }
      },
    }
  )
);
