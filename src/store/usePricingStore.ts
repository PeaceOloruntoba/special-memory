import { create } from "zustand";

type PricingStore = {
  currentPlan: string;
  subscriptionStatus: string;
  startDate: string | null;
  dueDate: string | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  fetchSubscriptionStatus: () => Promise<void>;
  subscribeToPlan: (planId: any, paymentMethodId: any) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  reset: () => void;
};

const usePricingStore = create<PricingStore>((set, get) => ({
  currentPlan: "free",
  subscriptionStatus: "inactive",
  startDate: null,
  dueDate: null,
  isLoading: false,
  error: null,
  successMessage: null,

  fetchSubscriptionStatus: async () => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const response = await fetch("/api/v1/subscriptions");
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch subscription status."
        );
      }
      set({
        currentPlan: result.data.planId,
        subscriptionStatus: result.data.status,
        startDate: result.data.startDate,
        dueDate: result.data.dueDate,
        isLoading: false,
      });
    } catch (err: any) {
      console.error("Error fetching subscription status:", err);
      set({ isLoading: false, error: err.message });
    }
  },

  subscribeToPlan: async (planId: any, paymentMethodId: any) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const response = await fetch("/api/v1/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId, paymentMethodId }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Subscription failed.");
      }
      set({
        currentPlan: planId,
        subscriptionStatus: result.data.subscription.status,
        isLoading: false,
        successMessage: result.message,
      });
      get().fetchSubscriptionStatus();
    } catch (err: any) {
      console.error("Error subscribing to plan:", err);
      set({ isLoading: false, error: err.message });
    }
  },

  cancelSubscription: async () => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const response = await fetch("/api/v1/subscriptions/cancel", {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Cancellation failed.");
      }
      set({
        isLoading: false,
        successMessage: result.message,
      });
      get().fetchSubscriptionStatus();
    } catch (err: any) {
      console.error("Error cancelling subscription:", err);
      set({ isLoading: false, error: err.message });
    }
  },

  reset: () => {
    set({
      currentPlan: "free",
      subscriptionStatus: "inactive",
      startDate: null,
      dueDate: null,
      isLoading: false,
      error: null,
      successMessage: null,
    });
  },
}));

export default usePricingStore;
