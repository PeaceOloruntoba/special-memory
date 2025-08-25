import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import api from "../utils/api";
import { toast } from "sonner";
import { handleError } from "../utils/handleError";

interface Pattern {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  garmentType: string;
  style: string;
  sizeRange: string;
  fabricType: string;
  occasion?: string;
  additionalDetails?: string;
  image_urls: string[];
  isAiGenerated: boolean;
  isWatermarked: boolean;
  difficulty?: string;
  instructions: string[];
  materials: string[];
  createdAt: string;
  updatedAt: string;
}

interface PatternStore {
  userPatterns: Pattern[];
  publicPatterns: Pattern[];
  loading: boolean;
  error: string | null;
  fetchUserPatterns: () => Promise<void>;
  fetchPublicPatterns: () => Promise<void>;
  createPattern: (
    patternData: Partial<Pattern>,
    base64Image?: string | null,
    isAiGenerated?: boolean,
    navigate?: any
  ) => Promise<void>;
  updatePattern: (
    patternId: string,
    updateData: Partial<Pattern>,
    base64Image?: string | null
  ) => Promise<void>;
  deletePattern: (patternId: string) => Promise<void>;
  getSinglePattern: (patternId: string) => Promise<Pattern | undefined>;
  movePatternToPublic: (patternId: string) => Promise<void>;
}

export const usePatternStore = create<PatternStore>()(
  persist(
    (set, get) => ({
      userPatterns: [],
      publicPatterns: [],
      loading: false,
      error: null,

      fetchUserPatterns: async () => {
        set({ loading: true, error: null });
        try {
          const { data } = await api.get("/api/v1/patterns");
          set({ userPatterns: data.data.patterns });
        } catch (err: any) {
          const { message } = handleError(err);
          set({ error: message });
        } finally {
          set({ loading: false });
        }
      },

      fetchPublicPatterns: async () => {
        set({ loading: true, error: null });
        try {
          const { data } = await api.get("api/v1/patterns/public");
          set({ publicPatterns: data.data.patterns });
        } catch (err: any) {
          const { message } = handleError(err);
          set({ error: message });
        } finally {
          set({ loading: false });
        }
      },

      createPattern: async (
        patternData,
        base64Image = null,
        isAiGenerated = false,
        navigate?: any
      ) => {
        set({ loading: true, error: null });
        try {
          const payload = { ...patternData, base64Image, isAiGenerated };
          await api.post("api/v1/patterns", payload);
          await get().fetchUserPatterns();
          await get().fetchPublicPatterns();
          toast.success("Pattern created successfully");
        } catch (err: any) {
          const { message } = handleError(err, navigate);
          set({ error: message });
        } finally {
          set({ loading: false });
        }
      },

      updatePattern: async (patternId, updateData, base64Image = null) => {
        set({ loading: true, error: null });
        try {
          const payload = { ...updateData, base64Image };
          await api.patch(`api/v1/patterns/${patternId}`, payload);
          await get().fetchUserPatterns();
          await get().fetchPublicPatterns();
          toast.success("Pattern updated successfully");
        } catch (err: any) {
          const { message } = handleError(err);
          set({ error: message });
        } finally {
          set({ loading: false });
        }
      },

      deletePattern: async (patternId) => {
        set({ loading: true, error: null });
        try {
          await api.delete(`api/v1/patterns/${patternId}`);
          await get().fetchUserPatterns();
          await get().fetchPublicPatterns();
          toast.success("Pattern deleted successfully");
        } catch (err: any) {
          const { message } = handleError(err);
          set({ error: message });
        } finally {
          set({ loading: false });
        }
      },

      getSinglePattern: async (patternId) => {
        set({ loading: true, error: null });
        try {
          const { data } = await api.get(`api/v1/patterns/${patternId}`);
          return data.data.pattern;
        } catch (err: any) {
          const { message } = handleError(err);
          set({ error: message });
          return undefined;
        } finally {
          set({ loading: false });
        }
      },

      movePatternToPublic: async (patternId) => {
        set({ loading: true, error: null });
        try {
          await api.patch(`api/v1/patterns/public/${patternId}`);
          await get().fetchUserPatterns();
          await get().fetchPublicPatterns();
          toast.success("Pattern moved to public library successfully!");
        } catch (err: any) {
          const { message } = handleError(err);
          set({ error: message });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "pattern-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userPatterns: state.userPatterns,
        publicPatterns: state.publicPatterns,
      }),
      version: 1,
    }
  )
);
