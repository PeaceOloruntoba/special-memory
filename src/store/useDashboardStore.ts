import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api";
import { toast } from "sonner";
import { handleError } from "../utils/handleError";

interface RevenueStats {
  currentMonth: number;
  lastMonth: number;
  changePercentage: number;
}

interface UpcomingDeadline {
  id: string;
  title: string;
  clientName: string;
  dueDate: string;
  priority: string;
}

interface RecentActivityItem {
  id: string;
  type: string;
  description: string;
  createdAt: string;
}

interface ActiveClientsStats {
  currentMonthCount: number;
  changeFromLastMonth: number;
}

interface DashboardStats {
  activeClients: ActiveClientsStats;
  activeProjects: number;
  projectsDueThisWeek: number;
  patternsCreated: number;
  patternsCreatedThisWeek: number;
  revenue: RevenueStats;
  upcomingDeadlines: UpcomingDeadline[];
  recentActivity: RecentActivityItem[];
}

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  fetchDashboardStats: () => Promise<void>;
  clearDashboardStats: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, _get) => ({
      stats: null,
      isLoading: false,
      error: null,
      lastFetched: null,

      fetchDashboardStats: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get("/api/v1/dashboard/stats");
          const dashboardData: DashboardStats = response.data.data;

          set({
            stats: dashboardData,
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
          });
          toast.success("Dashboard data refreshed!");
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isLoading: false });
          console.error("Dashboard fetch error:", error);
        }
      },

      clearDashboardStats: () => {
        set({ stats: null, isLoading: false, error: null, lastFetched: null });
      },
    }),
    {
      name: "dashboard-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        stats: state.stats,
        lastFetched: state.lastFetched,
      }),
      version: 1,
    }
  )
);
