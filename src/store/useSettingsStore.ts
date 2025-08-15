// Updated useSettingsStore (assuming it's a Zustand store)
// Path: src/store/useSettingsStore.ts

import { create } from "zustand";
import axios from "axios";
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
  // Add other fields as needed
}

interface SettingsStore {
  user: User | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
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

const API_URL = "/api/users"; // Adjust based on your API base URL

export const useSettingsStore = create<SettingsStore>((set, _get) => ({
  user: null,
  isLoading: false,
  isUpdating: false,
  error: null,

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/profile`);
      set({ user: response.data.data.user, isLoading: false });
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
      const response = await axios.patch(`${API_URL}/profile`, profileData);
      set({ user: response.data.data.user, isUpdating: false });
      toast.success("Profile updated successfully");
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
      const response = await axios.patch(`${API_URL}/notifications`, {
        settings: notifications,
      });
      set({ user: response.data.data.user, isUpdating: false });
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
      const response = await axios.patch(`${API_URL}/preferences`, {
        settings: preferences,
      });
      set({ user: response.data.data.user, isUpdating: false });
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
      const response = await axios.patch(`${API_URL}/password`, {
        currentPassword,
        newPassword,
      });
      response
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
      const response = await axios.patch(`${API_URL}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ user: response.data.data.user, isUpdating: false });
      toast.success("Profile image updated successfully");
    } catch (error: any) {
      const errMsg =
        error.response?.data?.message || "Failed to update profile image";
      set({ error: errMsg, isUpdating: false });
      toast.error(errMsg);
      throw error;
    }
  },
}));
