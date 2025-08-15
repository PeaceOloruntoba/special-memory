import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api";
import { toast } from "sonner";

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
}

interface SettingsStore {
  user: User | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchSettings: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  updateNotifications: (notifications: Partial<UserSettings>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserSettings>) => Promise<void>;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  updateProfileImage: (file: File) => Promise<void>;
}

const API_USER_URL = "/api/v1/user";

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, _get) => ({
      user: null,
      isLoading: false,
      isUpdating: false,
      error: null,
      lastFetched: null,

      fetchSettings: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get(`${API_USER_URL}`);
          const userData: User = response.data.data.user;
          set({ user: userData, isLoading: false, lastFetched: Date.now() });
          toast.success("Settings loaded successfully!");
        } catch (error: any) {
          const errMsg =
            error.response?.data?.message || "Failed to fetch settings";
          set({ error: errMsg, isLoading: false });
          toast.error(errMsg);
        }
      },

      updateProfile: async (profileData) => {
        set({ isUpdating: true, error: null });
        try {
          const response = await api.patch(
            `${API_USER_URL}/profile`,
            profileData
          );
          const updatedUser: User = response.data.data.user;
          set({ user: updatedUser, isUpdating: false });
          toast.success("Profile updated successfully!");
        } catch (error: any) {
          const errMsg =
            error.response?.data?.message || "Failed to update profile";
          set({ error: errMsg, isUpdating: false });
          toast.error(errMsg);
          throw error;
        }
      },

      updateNotifications: async (notifications) => {
        set({ isUpdating: true, error: null });
        try {
          const response = await api.patch(`${API_USER_URL}/notifications`, {
            settings: notifications,
          });
          const updatedUser: User = response.data.data.user;
          set({ user: updatedUser, isUpdating: false });
          toast.success("Notifications updated successfully");
        } catch (error: any) {
          const errMsg =
            error.response?.data?.message || "Failed to update notifications";
          set({ error: errMsg, isUpdating: false });
          toast.error(errMsg);
          throw error;
        }
      },

      updatePreferences: async (preferences) => {
        set({ isUpdating: true, error: null });
        try {
          const response = await api.patch(`${API_USER_URL}/preferences`, {
            settings: preferences,
          });
          const updatedUser: User = response.data.data.user;
          set({ user: updatedUser, isUpdating: false });
          toast.success("Preferences updated successfully");
        } catch (error: any) {
          const errMsg =
            error.response?.data?.message || "Failed to update preferences";
          set({ error: errMsg, isUpdating: false });
          toast.error(errMsg);
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
          const errMsg =
            error.response?.data?.message || "Failed to update password";
          set({ error: errMsg, isUpdating: false });
          toast.error(errMsg);
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
          const updatedUser: User = response.data.data.user;
          set({ user: updatedUser, isUpdating: false });
          toast.success("Profile image updated successfully");
        } catch (error: any) {
          const errMsg =
            error.response?.data?.message || "Failed to update profile image";
          set({ error: errMsg, isUpdating: false });
          toast.error(errMsg);
          throw error;
        }
      },
    }),
    {
      name: "user-settings-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        lastFetched: state.lastFetched,
      }),
      version: 1,
    }
  )
);
