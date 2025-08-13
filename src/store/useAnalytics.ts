import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api";
import { toast } from "sonner";

interface KeyMetrics {
  totalRevenue: number;
  totalRevenueChange: number;
  activeClients: number;
  activeClientsChange: number;
  projectsCompleted: number;
  projectsCompletedChange: number;
  avgProjectValue: number;
  avgProjectValueChange: number;
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
  onTimeDeliveryRate: number;
  avgDaysToComplete: number;
  projectsDelayed: number;
}

interface EfficiencyMetrics {
  timeEfficiencyByProjectType: {
    type: string;
    avgHours: number;
    efficiencyScore: number;
  }[];
  resourceUtilization: { overall: number; peak: number; offPeak: number };
  qualityMetrics: {
    avgClientRating: number;
    avgRevisions: number;
    firstFitSuccessRate: number;
  };
}

interface AnalyticsData {
  keyMetrics: KeyMetrics;
  revenueAnalysis: {
    monthlyTrend: MonthlyTrendData[];
    byServiceType: ServiceTypeData[];
  };
  projectPerformance: {
    statusDistribution: ProjectStatusData[];
    timelinePerformance: ProjectTimelinePerformance;
  };
  efficiencyMetrics: EfficiencyMetrics;
}

interface AnalyticsState {
  analyticsData: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: { [key: string]: number | null };

  fetchAnalytics: (timePeriod: string) => Promise<void>;
  clearAnalyticsData: () => void;
}

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
      name: "analytics-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        analyticsData: state.analyticsData,
        lastFetched: state.lastFetched,
      }),
      version: 1,
    }
  )
);
