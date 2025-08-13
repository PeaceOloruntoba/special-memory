import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api";
import { toast } from "sonner";
import type { Invoice, InvoiceItem } from "../types/types";

interface InvoiceState {
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  addInvoice: (invoiceData: {
    clientId: string;
    projectId?: string;
    invoiceNumber: string;
    dueDate: string;
    items: InvoiceItem[];
  }) => Promise<void>;
  getAllInvoices: (filterOptions?: {
    clientId?: string;
    projectId?: string;
  }) => Promise<void>;
  getSingleInvoice: (invoiceId: string) => Promise<Invoice | null>;
  updateInvoice: (
    invoiceId: string,
    updateData: Partial<{
      clientId: string;
      projectId?: string;
      invoiceNumber: string;
      dueDate: string;
      status: "draft" | "sent" | "paid" | "overdue";
      items: InvoiceItem[];
    }>
  ) => Promise<void>;
  deleteInvoice: (invoiceId: string) => Promise<void>;
  clearInvoices: () => void;
}

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set, _get) => ({
      invoices: [],
      isLoading: false,
      error: null,
      lastFetched: null,

      addInvoice: async (invoiceData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/api/v1/invoices", invoiceData);
          const newInvoice: Invoice = {
            ...response.data.data.invoice,
            id: response.data.data.invoice._id,
            clientId: response.data.data.invoice.clientId._id,
            projectId: response.data.data.invoice.projectId?._id,
          };

          set((state) => ({
            invoices: [newInvoice, ...state.invoices],
            isLoading: false,
            error: null,
          }));
          toast.success("Invoice added successfully!");
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to add invoice.";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      getAllInvoices: async (filterOptions) => {
        set({ isLoading: true, error: null });
        try {
          let url = "/api/v1/invoices";
          if (filterOptions?.clientId) {
            url = `/api/v1/invoices/${filterOptions.clientId}`;
          } else if (filterOptions?.projectId) {
            url = `/api/v1/invoices/${filterOptions.projectId}`;
          }

          const response = await api.get(url);
          const fetchedInvoices: Invoice[] = response.data.data.invoices.map(
            (inv: any) => ({
              ...inv,
              id: inv._id,
              clientId: inv.clientId._id,
              projectId: inv.projectId?._id,
            })
          );

          set({
            invoices: fetchedInvoices,
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
          });
          toast.success("Invoices loaded successfully!");
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to load invoices.";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      getSingleInvoice: async (invoiceId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get(`/api/v1/invoices/${invoiceId}`);
          const fetchedInvoice: Invoice = {
            ...response.data.data.invoice,
            id: response.data.data.invoice._id,
            clientId: response.data.data.invoice.clientId._id,
            projectId: response.data.data.invoice.projectId?._id,
          };

          set({ isLoading: false, error: null });
          return fetchedInvoice;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to load invoice details.";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      updateInvoice: async (invoiceId, updateData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.patch(
            `/api/v1/invoices/${invoiceId}`,
            updateData
          );
          const updatedInvoice: Invoice = {
            ...response.data.data.invoice,
            id: response.data.data.invoice._id,
            clientId: response.data.data.invoice.clientId._id,
            projectId: response.data.data.invoice.projectId?._id,
          };

          set((state) => ({
            invoices: state.invoices.map((inv) =>
              inv.id === invoiceId ? updatedInvoice : inv
            ),
            isLoading: false,
            error: null,
          }));
          toast.success("Invoice updated successfully!");
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to update invoice.";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      deleteInvoice: async (invoiceId) => {
        set({ isLoading: true, error: null });
        try {
          await api.delete(`/api/v1/invoices/${invoiceId}`);

          set((state) => ({
            invoices: state.invoices.filter((inv) => inv.id !== invoiceId),
            isLoading: false,
            error: null,
          }));
          toast.success("Invoice deleted successfully!");
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to delete invoice.";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      clearInvoices: () => {
        set({ invoices: [], isLoading: false, error: null, lastFetched: null });
      },
    }),
    {
      name: "invoice-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        invoices: state.invoices,
        lastFetched: state.lastFetched,
      }),
      version: 1,
    }
  )
);
