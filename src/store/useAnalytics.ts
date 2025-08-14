// store/useAnalyticsStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api";
import { toast } from "sonner";

// --- Interfaces ---

interface KeyMetrics {
  totalRevenue: number;
  totalRevenueChange: number; // percentage change
  activeClients: number; // Total active clients
  activeClientsChange: number; // percentage change
  projectsCompleted: number;
  projectsCompletedChange: number; // percentage change
  avgProjectValue: number;
  avgProjectValueChange: number; // percentage change
}

interface MonthlyTrendData {
  month: string;
  year: number;
  revenue: number;
}

interface ServiceTypeData {
  type: string;
  count: number;
  revenue: number;
  percentage: number;
}

interface ProjectStatusData {
  status: string;
  count: number;
  percentage: number;
}

interface ProjectTimelinePerformance {
  onTimeDeliveryRate: number; // percentage
  avgDaysToComplete: number;
  projectsDelayed: number;
}

interface TopClientData {
  id: string;
  name: string;
  projects: number; // Number of projects for this client
  value: number; // Total revenue from this client
}

interface ClientInsights {
  // New structure for client insights
  newClientsThisPeriod: number;
  avgProjectsPerClient: number;
  topClients: TopClientData[];
}

// AnalyticsData structure to match the backend response
interface AnalyticsData {
  keyMetrics: KeyMetrics;
  revenueAnalysis: {
    monthlyTrend: MonthlyTrendData[];
    byServiceType: ServiceTypeData[];
  };
  clientInsights: ClientInsights; // Updated to use the new interface
  projectPerformance: {
    statusDistribution: ProjectStatusData[];
    timelinePerformance: ProjectTimelinePerformance;
  };
  // efficiencyMetrics removed
}

interface AnalyticsState {
  analyticsData: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: { [key: string]: number | null }; // Stores timestamp per timePeriod

  fetchAnalytics: (timePeriod: string) => Promise<void>;
  clearAnalyticsData: () => void;
}

// --- Analytics Store ---
export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, _get) => ({
      analyticsData: null,
      isLoading: false,
      error: null,
      lastFetched: {},

      /**
       * Fetches analytics data for a specific time period.
       * @param timePeriod - The desired time frame (e.g., "1month", "6months", "1year", "all").
       */
      fetchAnalytics: async (timePeriod: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get(
            `/api/v1/analytics/stats?timePeriod=${timePeriod}`
          );
          const fetchedData: AnalyticsData = response.data.data;

          set((state) => ({
            analyticsData: fetchedData,
            isLoading: false,
            error: null,
            lastFetched: {
              ...state.lastFetched,
              [timePeriod]: Date.now(),
            },
          }));
          toast.success(
            `Analytics data for ${timePeriod} loaded successfully!`
          );
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            `Failed to fetch analytics data for ${timePeriod}.`;
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          console.error(`Analytics fetch error for ${timePeriod}:`, error);
          throw error;
        }
      },

      /**
       * Clears all analytics data from the store.
       */
      clearAnalyticsData: () => {
        set({
          analyticsData: null,
          isLoading: false,
          error: null,
          lastFetched: {},
        });
      },
    }),
    {
      name: "analytics-storage", // Name for localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        analyticsData: state.analyticsData,
        lastFetched: state.lastFetched,
      }),
      version: 1,
      // Optional: onRehydrateStorage can be used to refetch data if it's too old
      // This could involve iterating through lastFetched and refetching stale periods
    }
  )
);
