import { create } from "zustand";
import { toast } from "sonner";
import api from "../utils/api"; // Import the Axios instance

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
  subscribeToPlan: (planId: string, paymentMethodId?: string) => Promise<void>;
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
      const response = await api.get("/api/v1/subscriptions/details");
      set({
        currentPlan: response.data.data.planId,
        subscriptionStatus: response.data.data.status,
        startDate: response.data.data.startDate,
        dueDate: response.data.data.dueDate,
        paymentMethod: response.data.data.paymentMethod,
        invoices: response.data.data.invoices,
        isLoading: false,
      });
    } catch (err: any) {
      const errMsg = err.message || "Failed to fetch subscription details";
      set({ isLoading: false, error: errMsg });
      toast.error(errMsg);
    }
  },

  subscribeToPlan: async (planId: string, paymentMethodId?: string) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const response = await api.post("/api/v1/subscriptions", {
        planId,
        paymentMethodId,
      });
      set({
        currentPlan: planId,
        subscriptionStatus: response.data.data.subscription.status,
        isLoading: false,
        successMessage: response.data.message || "Subscription successful",
      });
      get().fetchSubscriptionDetails();
    } catch (err: any) {
      const errMsg = err.message || "Subscription failed";
      set({ isLoading: false, error: errMsg });
      toast.error(errMsg);
      throw err;
    }
  },

  cancelSubscription: async () => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const response = await api.post("/api/v1/subscriptions/cancel");
      set({
        isLoading: false,
        successMessage:
          response.data.message || "Subscription cancelled successfully",
      });
      get().fetchSubscriptionDetails();
    } catch (err: any) {
      const errMsg = err.message || "Cancellation failed";
      set({ isLoading: false, error: errMsg });
      toast.error(errMsg);
      throw err;
    }
  },

  updatePaymentMethod: async (paymentMethodId: string) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const response = await api.patch("/api/v1/subscriptions/payment-method", {
        paymentMethodId,
      });
      set({
        isLoading: false,
        successMessage:
          response.data.message || "Payment method updated successfully",
      });
      get().fetchSubscriptionDetails();
    } catch (err: any) {
      const errMsg = err.message || "Failed to update payment method";
      set({ isLoading: false, error: errMsg });
      toast.error(errMsg);
      throw err;
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
