import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api"; // Assuming your axios instance
import { toast } from "sonner"; // For displaying notifications

// --- Interfaces for User Data and Settings ---

/**
 * Represents the structure of user data as returned by the backend's /api/user endpoint.
 * This directly maps to your Mongoose UserSchema.
 */
interface UserData {
  _id: string; // MongoDB document ID
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
  bio?: string;
  website?: string;
  businessName?: string;
  businessType?: string[];
  roles?: string[];
  isEmailVerified: boolean;
  sendNewsletter: boolean;
  image: string;
  settings: {
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
  };
  plan: string;
  isSubActive: boolean;
  trialEndDate: string; // ISO date string
  subscriptionId?: string; // MongoDB ObjectId string
  revenueGoals: {
    monthly: number;
    yearly: number;
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Interface for the state managed by the Zustand store.
 */
interface UserSettingsState {
  user: UserData | null;
  isLoading: boolean; // Indicates if data is currently being fetched
  isUpdating: boolean; // Indicates if any update operation is in progress
  error: string | null; // Stores any error message
  lastFetched: number | null; // Timestamp of the last successful data fetch

  // --- Actions ---

  /**
   * Fetches the current user's settings and profile information from the backend.
   */
  fetchSettings: () => Promise<void>;

  /**
   * Updates general profile information and nested settings.
   * Properties are partial to allow updating only specific fields.
   * @param profileUpdates Partial data for top-level user fields (firstName, lastName, email, etc.)
   * @param settingsUpdates Partial data for nested settings fields (emailNotifications, theme, etc.)
   */
  updateProfileInfo: (
    profileUpdates: Partial<
      Omit<UserData, "settings" | "_id" | "createdAt" | "updatedAt">
    >, // Exclude settings and readonly fields
    settingsUpdates?: Partial<UserData["settings"]>
  ) => Promise<void>;

  /**
   * Updates the user's password.
   * @param currentPassword The user's current password.
   * @param newPassword The new password to set.
   */
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;

  /**
   * Updates the user's profile image.
   * @param imageFile The File object representing the new profile image.
   */
  updateProfileImage: (imageFile: File) => Promise<void>;

  /**
   * Clears all user settings and data from the store, typically on logout.
   */
  clearSettings: () => void;
}

// --- Zustand Store Creation ---

export const useSettingsStore = create<UserSettingsState>()(
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
          const response = await api.get("/api/v1/user");
          console.log(response);
          const userData: UserData = response.data.data.user; // Adjust path based on your actual API response structure (e.g., response.data.user)
          set({
            user: userData,
            isLoading: false,
            lastFetched: Date.now(),
          });
          toast.success("Settings loaded successfully!");
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to fetch settings.";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          console.error("Fetch settings error:", error);
        }
      },

      updateProfileInfo: async (profileUpdates, settingsUpdates) => {
        set({ isUpdating: true, error: null });
        try {
          // Construct the payload to send to the backend
          const payload: any = { ...profileUpdates };
          if (settingsUpdates) {
            payload.settings = settingsUpdates;
          }

          const response = await api.patch("/api/user/profile", payload); // PATCH /api/user/profile
          const updatedUser: UserData = response.data.data.user; // Adjust path as needed
          set({
            user: updatedUser,
            isUpdating: false,
          });
          toast.success("Profile updated successfully!");
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to update profile.";
          set({ error: errorMessage, isUpdating: false });
          toast.error(errorMessage);
          console.error("Update profile error:", error);
        }
      },

      updatePassword: async (currentPassword, newPassword) => {
        set({ isUpdating: true, error: null });
        try {
          await api.patch("/api/user/password", {
            // PATCH /api/user/password
            currentPassword,
            newPassword,
          });
          set({ isUpdating: false });
          toast.success("Password updated successfully!");
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to update password.";
          set({ error: errorMessage, isUpdating: false });
          toast.error(errorMessage);
          console.error("Update password error:", error);
        }
      },

      updateProfileImage: async (imageFile) => {
        set({ isUpdating: true, error: null });
        try {
          const formData = new FormData();
          formData.append("image", imageFile); // 'image' key must match backend's expected field name

          const response = await api.patch("/api/user/image", formData, {
            // PATCH /api/user/image
            headers: {
              "Content-Type": "multipart/form-data", // Important for file uploads
            },
          });
          const updatedUser: UserData = response.data.data.user; // Adjust path as needed
          set({
            user: updatedUser,
            isUpdating: false,
          });
          toast.success("Profile image updated successfully!");
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to update image.";
          set({ error: errorMessage, isUpdating: false });
          toast.error(errorMessage);
          console.error("Update image error:", error);
        }
      },

      clearSettings: () => {
        set({
          user: null,
          isLoading: false,
          isUpdating: false,
          error: null,
          lastFetched: null,
        });
      },
    }),
    {
      name: "user-settings-storage", // Unique name for the local storage key
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
      partialize: (state) => ({
        user: state.user, // Only persist the user data
        lastFetched: state.lastFetched, // Also persist the last fetched timestamp
      }),
      version: 1, // Increment this number if you change the structure of the persisted state
    }
  )
);
