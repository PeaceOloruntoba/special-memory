import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import api from "../utils/api"; // Your custom API instance
import { handleError } from "../utils/handleError";

// --- Interfaces for User Data and Settings ---

interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  projectDeadlines: boolean;
  clientMessages: boolean;
  paymentReminders: boolean;
  marketingEmails: boolean;
  theme: string;
  language: string;
  timezone: string;
  currency: string;
  measurementUnit: string;
  defaultProjectDuration: string;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  website?: string;
  image?: string;
  settings: UserSettings;
  plan: string;
  isSubActive: boolean;
  lastLogin?: string;
  activeSessions?: Array<{
    device: string;
    location: string;
    lastActive: string;
    current: boolean;
  }>;
  is2FAEnabled: boolean;
}

interface SubscriptionDetails {
  planId: string;
  status: string;
  startDate: string | null;
  dueDate: string | null;
  paymentMethod: { brand: string; last4: string; exp: string } | null;
  invoices: Array<{ date: string; amount: string; status: string }>;
}

interface SettingsStore {
  user: User | null;
  subscriptionDetails: SubscriptionDetails | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  lastFetched: number | null; // Added to help with re-fetching logic

  fetchSettings: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  updateNotifications: (notifications: Partial<UserSettings>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserSettings>) => Promise<void>;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  updateProfileImage: (file: File) => Promise<void>;
  fetchSubscriptionDetails: () => Promise<void>;
  subscribePlan: (planId: string, paymentMethodId?: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  updatePaymentMethod: (paymentMethodId: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  toggle2FA: (enable: boolean) => Promise<void>;
  logoutAll: () => Promise<void>;
}

const API_USER_URL = "/api/v1/user";
const SUB_API_URL = "/api/v1/subscriptions";

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      user: null,
      subscriptionDetails: null,
      isLoading: false,
      isUpdating: false,
      error: null,
      lastFetched: null,

      fetchSettings: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get(`${API_USER_URL}/profile`);
          set({
            user: response.data.data.user,
            isLoading: false,
            lastFetched: Date.now(),
          });
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isLoading: false });
        }
      },

      updateProfile: async (profileData) => {
        set({ isUpdating: true, error: null });
        try {
          const response = await api.patch(
            `${API_USER_URL}/profile`,
            profileData
          );
          set({ user: response.data.data.user, isUpdating: false });
          toast.success("Profile updated successfully");
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isUpdating: false });
          throw error;
        }
      },

      updateNotifications: async (notifications) => {
        set({ isUpdating: true, error: null });
        try {
          const response = await api.patch(`${API_USER_URL}/notifications`, {
            settings: notifications,
          });
          set({ user: response.data.data.user, isUpdating: false });
          toast.success("Notifications updated successfully");
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isUpdating: false });
          throw error;
        }
      },

      updatePreferences: async (preferences) => {
        set({ isUpdating: true, error: null });
        try {
          const response = await api.patch(`${API_USER_URL}/preferences`, {
            settings: preferences,
          });
          set({ user: response.data.data.user, isUpdating: false });
          toast.success("Preferences updated successfully");
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isUpdating: false });
          throw error;
        }
      },

      updatePassword: async (currentPassword, newPassword) => {
        set({ isUpdating: true, error: null });
        try {
          await api.patch(`${API_USER_URL}/password`, {
            currentPassword,
            newPassword,
          });
          set({ isUpdating: false });
          toast.success("Password updated successfully");
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isUpdating: false });
          throw error;
        }
      },

      updateProfileImage: async (file) => {
        set({ isUpdating: true, error: null });
        try {
          const formData = new FormData();
          formData.append("image", file);
          const response = await api.patch(`${API_USER_URL}/image`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          set({ user: response.data.data.user, isUpdating: false });
          toast.success("Profile image updated successfully");
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isUpdating: false });
          throw error;
        }
      },

      fetchSubscriptionDetails: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get(`${SUB_API_URL}/details`);
          set({ subscriptionDetails: response.data.data, isLoading: false });
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isLoading: false });
        }
      },

      subscribePlan: async (planId, paymentMethodId) => {
        set({ isUpdating: true, error: null });
        try {
          await api.post(`${SUB_API_URL}/`, { planId, paymentMethodId });
          set({ isUpdating: false });
          toast.success("Plan updated successfully");
          get().fetchSubscriptionDetails();
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isUpdating: false });
          throw error;
        }
      },

      cancelSubscription: async () => {
        set({ isUpdating: true, error: null });
        try {
          await api.post(`${SUB_API_URL}/cancel`);
          set({ isUpdating: false });
          toast.success("Subscription cancelled successfully");
          get().fetchSubscriptionDetails();
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isUpdating: false });
          throw error;
        }
      },

      updatePaymentMethod: async (paymentMethodId) => {
        set({ isUpdating: true, error: null });
        try {
          await api.patch(`${SUB_API_URL}/payment-method`, { paymentMethodId });
          set({ isUpdating: false });
          toast.success("Payment method updated successfully");
          get().fetchSubscriptionDetails();
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isUpdating: false });
          throw error;
        }
      },

      deleteAccount: async () => {
        set({ isUpdating: true, error: null });
        try {
          await api.post(`${API_USER_URL}/delete-account`);
          set({ isUpdating: false });
          toast.success("Account deleted successfully");
          // Clear the store and potentially redirect
          set({ user: null, subscriptionDetails: null });
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isUpdating: false });
          throw error;
        }
      },

      toggle2FA: async (enable) => {
        set({ isUpdating: true, error: null });
        try {
          const response = await api.patch(`${API_USER_URL}/2fa`, { enable });
          response
          set({
            user: { ...get().user!, is2FAEnabled: enable },
            isUpdating: false,
          });
          toast.success(`2FA ${enable ? "enabled" : "disabled"} successfully`);
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isUpdating: false });
          throw error;
        }
      },

      logoutAll: async () => {
        set({ isUpdating: true, error: null });
        try {
          await api.post(`${API_USER_URL}/logout-all`);
          set({
            user: { ...get().user!, activeSessions: [] },
            isUpdating: false,
          });
          toast.success("Logged out from all sessions");
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isUpdating: false });
          throw error;
        }
      },
    }),
    {
      name: "settings-store-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        subscriptionDetails: state.subscriptionDetails,
        lastFetched: state.lastFetched,
      }),
      version: 2, // Incrementing version due to new state and API changes
    }
  )
);
