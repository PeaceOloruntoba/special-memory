import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api";
import { toast } from "sonner";

interface MeasurementDetail {
  name: string;
  size: number;
  unit?: string;
}

interface Measurement {
  id: string;
  userId: string;
  clientId: string;
  garmentType: string;
  measurements: MeasurementDetail[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface MeasurementState {
  measurements: Measurement[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  addMeasurement: (measurementData: {
    clientId: string;
    garmentType: string;
    measurements: MeasurementDetail[];
    notes?: string;
  }) => Promise<void>;
  getAllMeasurements: (clientId?: string) => Promise<void>;
  getSingleMeasurement: (measurementId: string) => Promise<Measurement | null>;
  updateMeasurement: (
    measurementId: string,
    updateData: Partial<Measurement>
  ) => Promise<void>;
  deleteMeasurement: (measurementId: string) => Promise<void>;
  clearMeasurements: () => void;
}

export const useMeasurementStore = create<MeasurementState>()(
  persist(
    (set, _get) => ({
      measurements: [],
      isLoading: false,
      error: null,
      lastFetched: null,

      /**
       * Adds a new measurement record to the database and updates the store.
       * @param measurementData - The data for the new measurement (clientId, garmentType, measurements array, notes).
       */
      addMeasurement: async (measurementData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post(
            "/api/v1/measurements",
            measurementData
          );
          const newMeasurement: Measurement = {
            ...response.data.data.measurement,
            id: response.data.data.measurement._id,
          };

          set((state) => ({
            measurements: [newMeasurement, ...state.measurements],
            isLoading: false,
            error: null,
          }));
          toast.success("Measurement added successfully!");
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to add measurement.";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      /**
       * Fetches all measurement records for the authenticated user, optionally filtered by client, and updates the store.
       * @param clientId (optional) - If provided, fetches measurements only for this specific client.
       */
      getAllMeasurements: async (clientId?: string) => {
        set({ isLoading: true, error: null });
        try {
          const url = clientId
            ? `/api/v1/clients/${clientId}/measurements`
            : "/api/v1/measurements";
          const response = await api.get(url);
          const fetchedMeasurements: Measurement[] =
            response.data.data.measurements.map((m: any) => ({
              ...m,
              id: m._id,
            }));

          set({
            measurements: fetchedMeasurements,
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
          });
          toast.success("Measurements loaded successfully!");
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to load measurements.";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      /**
       * Fetches a single measurement record by its ID.
       * The UI usually accesses measurements from the 'measurements' array fetched by getAllMeasurements.
       * This action is useful for fetching specific details or validating existence.
       * @param measurementId - The ID of the measurement record to fetch.
       * @returns The measurement object or null if not found/error.
       */
      getSingleMeasurement: async (measurementId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get(
            `/api/v1/measurements/${measurementId}`
          );
          const fetchedMeasurement: Measurement = {
            ...response.data.data.measurement,
            id: response.data.data.measurement._id,
          };

          set({ isLoading: false, error: null });
          return fetchedMeasurement;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            "Failed to load measurement details.";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      /**
       * Updates an existing measurement record in the database and the store.
       * @param measurementId - The ID of the measurement record to update.
       * @param updateData - The data to update (partial Measurement object).
       */
      updateMeasurement: async (measurementId, updateData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.patch(
            `/api/v1/measurements/${measurementId}`,
            updateData
          );
          const updatedMeasurement: Measurement = {
            ...response.data.data.measurement,
            id: response.data.data.measurement._id,
          };

          set((state) => ({
            measurements: state.measurements.map((m) =>
              m.id === measurementId ? updatedMeasurement : m
            ),
            isLoading: false,
            error: null,
          }));
          toast.success("Measurement updated successfully!");
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to update measurement.";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      /**
       * Deletes a measurement record from the database and the store.
       * @param measurementId - The ID of the measurement record to delete.
       */
      deleteMeasurement: async (measurementId) => {
        set({ isLoading: true, error: null });
        try {
          await api.delete(`/api/v1/measurements/${measurementId}`);

          set((state) => ({
            measurements: state.measurements.filter(
              (m) => m.id !== measurementId
            ),
            isLoading: false,
            error: null,
          }));
          toast.success("Measurement deleted successfully!");
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to delete measurement.";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      /**
       * Clears all measurement data from the store.
       */
      clearMeasurements: () => {
        set({
          measurements: [],
          isLoading: false,
          error: null,
          lastFetched: null,
        });
      },
    }),
    {
      name: "measurement-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        measurements: state.measurements,
        lastFetched: state.lastFetched,
      }),
      version: 1,
    }
  )
);
