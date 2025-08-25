import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api";
import { toast } from "sonner";
import { handleError } from "../utils/handleError";

interface User {
  isAdmin?: boolean;
  id: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  businessType?: string | string[];
  image?: string;
  isEmailVerified?: boolean;
  plan?: "free" | "premium" | "enterprise";
  isSubActive?: boolean;
  trialEndDate?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  stripePublishableKey: string | null;
  emailForVerification: string | null;
  emailForPasswordReset: string | null;
  initializeAuth: () => Promise<void>;

  register: (userData: any, navigate: any) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

  sendAccountVerificationOtp: (email: string) => Promise<void>;
  verifyAccountOtp: (email: string, otp: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  loginWithFacebook: (accessToken: string) => Promise<void>;

  sendPasswordResetOtp: (email: string) => Promise<void>;
  resetPasswordWithOtp: (
    email: string,
    otp: string,
    newPassword: string
  ) => Promise<void>;

  clearEmailForVerification: () => void;
  clearEmailForPasswordReset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || null,
      emailForVerification: null,
      emailForPasswordReset: null,

      initializeAuth: async () => {
        const { token, user } = get();
        if (token && user) {
          set({ isLoading: true });
          try {
            const response = await api.get("/api/v1/auth");
            const fetchedUser = response.data.data.user;

            set({
              user: {
                id: fetchedUser.id || fetchedUser._id,
                email: fetchedUser.email,
                firstName: fetchedUser.firstName,
                lastName: fetchedUser.lastName,
                businessName: fetchedUser.businessName,
                businessType: fetchedUser.businessType,
                isEmailVerified: fetchedUser.isEmailVerified,
                image: fetchedUser.image,
                plan: fetchedUser.plan,
                isSubActive: fetchedUser.isSubActive,
                trialEndDate: fetchedUser.trialEndDate,
              },
              isLoading: false,
              error: null,
            });
            console.log("Auth re-initialized with fresh user data.");
          } catch (error: any) {
            console.error(
              "Failed to re-initialize auth or token expired:",
              error
            );
            const { message } = handleError(error);
            get().logout();
            set({ error: message, isLoading: false });
          }
        } else {
          set({ isLoading: false });
        }
      },

      register: async (userData, navigate) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/api/v1/auth/signup", userData);
          set({
            isLoading: false,
            emailForVerification: userData.email,
          });
          console.log("Registration response:", response.data);
          toast.success("Registration successful! Please verify your email.");
          navigate("/verify-otp?email=" + userData.email);
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/api/v1/auth/signin", {
            email,
            password,
          });
          const { token, user: loggedInUser } = response.data.data;

          set({
            user: {
              id: loggedInUser.id || loggedInUser._id,
              email: loggedInUser.email,
              firstName: loggedInUser.firstName,
              lastName: loggedInUser.lastName,
              businessName: loggedInUser.businessName,
              businessType: loggedInUser.businessType,
              isEmailVerified: loggedInUser.isEmailVerified,
              image: loggedInUser.image,
              plan: loggedInUser.plan,
              isSubActive: loggedInUser.isSubActive,
              trialEndDate: loggedInUser.trialEndDate,
            },
            token,
            isLoading: false,
          });
          toast.success("Logged in successfully!");
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      loginWithGoogle: async (idToken) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post("/api/v1/auth/oauth/google", { idToken });
          const { token, user: u } = res.data.data;
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          set({
            user: {
              id: u.id || u._id,
              email: u.email,
              firstName: u.firstName,
              lastName: u.lastName,
              businessName: u.businessName,
              businessType: u.businessType,
              isEmailVerified: u.isEmailVerified,
              image: u.image,
              plan: u.plan,
              isSubActive: u.isSubActive,
              trialEndDate: u.trialEndDate,
            },
            token,
            isLoading: false,
          });
          toast.success("Logged in with Google!");
        } catch (err: any) {
          const { message } = handleError(err);
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      loginWithFacebook: async (accessToken) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post("/api/v1/auth/oauth/facebook", {
            accessToken,
          });
          const { token, user: u } = res.data.data;
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          set({
            user: {
              id: u.id || u._id,
              email: u.email,
              firstName: u.firstName,
              lastName: u.lastName,
              businessName: u.businessName,
              businessType: u.businessType,
              isEmailVerified: u.isEmailVerified,
              image: u.image,
              plan: u.plan,
              isSubActive: u.isSubActive,
              trialEndDate: u.trialEndDate,
            },
            token,
            isLoading: false,
          });
          toast.success("Logged in with Facebook!");
        } catch (err: any) {
          const { message } = handleError(err);
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      logout: () => {
        if (api.defaults.headers.common["Authorization"]) {
          delete api.defaults.headers.common["Authorization"];
        }
        set({ user: null, token: null, isLoading: false, error: null });
        toast.info("Logged out successfully.");
      },

      sendAccountVerificationOtp: async (email) => {
        set({ isLoading: true, error: null, emailForVerification: email });
        try {
          await api.post("/api/v1/auth/send-otp", { email });
          set({ isLoading: false });
          toast.success(`Verification code sent to ${email}`);
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      verifyAccountOtp: async (email, otp) => {
        set({ isLoading: true, error: null });
        try {
          await api.post("/api/v1/auth/verify-otp", { email, otp });
          set({
            isLoading: false,
            emailForVerification: null,
          });
          toast.success("Account verified successfully! You can now log in.");
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      sendPasswordResetOtp: async (email) => {
        set({ isLoading: true, error: null, emailForPasswordReset: email });
        try {
          await api.post("/api/v1/auth/forgot-password", { email });
          set({ isLoading: false });
          toast.success(`Password reset code sent to ${email}`);
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      resetPasswordWithOtp: async (email, otp, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          await api.post("/api/v1/auth/reset-password", {
            email,
            otp,
            password: newPassword,
          });
          set({
            isLoading: false,
            emailForPasswordReset: null,
          });
          toast.success(
            "Password has been reset successfully! Please log in with your new password."
          );
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      clearEmailForVerification: () => set({ emailForVerification: null }),
      clearEmailForPasswordReset: () => set({ emailForPasswordReset: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,

        emailForVerification: state.emailForVerification,
        emailForPasswordReset: state.emailForPasswordReset,
      }),
      version: 1,
      onRehydrateStorage: (_state) => {
        return (persistedState) => {
          if (persistedState && persistedState.token) {
            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${persistedState.token}`;
          }
        };
      },
    }
  )
);
