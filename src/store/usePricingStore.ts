import { create } from "zustand";

type PricingStore = {
  currentPlan: string;
  subscriptionStatus: string;
  startDate: string | null;
  dueDate: string | null;
  paymentMethod: { brand: string; last4: string; exp: string } | null;
  invoices: Array<{ date: string; amount: string; status: string }>;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  fetchSubscriptionDetails: () => Promise<void>;
  subscribeToPlan: (planId: any, paymentMethodId: any) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  updatePaymentMethod: (paymentMethodId: string) => Promise<void>;
  reset: () => void;
};

const usePricingStore = create<PricingStore>((set, get) => ({
  currentPlan: "free",
  subscriptionStatus: "inactive",
  startDate: null,
  dueDate: null,
  paymentMethod: null,
  invoices: [],
  isLoading: false,
  error: null,
  successMessage: null,

  fetchSubscriptionDetails: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/v1/subscriptions/details");
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      set({
        currentPlan: result.data.planId,
        subscriptionStatus: result.data.status,
        startDate: result.data.startDate,
        dueDate: result.data.dueDate,
        paymentMethod: result.data.paymentMethod,
        invoices: result.data.invoices,
        isLoading: false,
      });
    } catch (err: any) {
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
      get().fetchSubscriptionDetails();
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
      get().fetchSubscriptionDetails();
    } catch (err: any) {
      console.error("Error cancelling subscription:", err);
      set({ isLoading: false, error: err.message });
    }
  },

  updatePaymentMethod: async (paymentMethodId: string) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const response = await fetch("/api/v1/subscriptions/payment-method", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethodId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      set({ isLoading: false, successMessage: result.message });
      get().fetchSubscriptionDetails();
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  reset: () => {
    set({
      currentPlan: "free",
      subscriptionStatus: "inactive",
      startDate: null,
      dueDate: null,
      paymentMethod: null,
      invoices: [],
      isLoading: false,
      error: null,
      successMessage: null,
    });
  },
}));

export default usePricingStore;
