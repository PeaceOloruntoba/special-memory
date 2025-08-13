import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api";
import { toast } from "sonner";

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Client {
  _id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  __v: number;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  budget: number;
  progress: number;
  dueDate: string;
  clientId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Invoice {
  id: string;
  userId: string;
  clientId: Client;
  projectId?: Project;
  invoiceNumber: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  dueDate: string;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

interface InvoiceState {
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  addInvoice: (invoiceData: {
    clientId: Client;
    projectId?: Project;
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
    updateData: Partial<Invoice>
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

      /**
       * Adds a new invoice record to the database and updates the store.
       * @param invoiceData - The data for the new invoice.
       */
      addInvoice: async (invoiceData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/api/v1/invoices", {
            ...invoiceData,
            clientId: invoiceData.clientId._id,
            projectId: invoiceData.projectId?._id,
          });
          const newInvoice: Invoice = {
            ...response.data.data.invoice,
            id: response.data.data.invoice._id,
            clientId: response.data.data.invoice.clientId,
            projectId: response.data.data.invoice.projectId,
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

      /**
       * Fetches all invoice records for the authenticated user, optionally filtered by client or project, and updates the store.
       * @param filterOptions - An object containing optional clientId or projectId for filtering.
       */
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
              clientId: inv.clientId,
              projectId: inv.projectId,
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

      /**
       * Fetches a single invoice record by its ID.
       * @param invoiceId - The ID of the invoice record to fetch.
       * @returns The invoice object or null if not found/error.
       */
      getSingleInvoice: async (invoiceId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get(`/api/v1/invoices/${invoiceId}`);
          const fetchedInvoice: Invoice = {
            ...response.data.data.invoice,
            id: response.data.data.invoice._id,
            clientId: response.data.data.invoice.clientId,
            projectId: response.data.data.invoice.projectId,
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

      /**
       * Updates an existing invoice record in the database and the store.
       * @param invoiceId - The ID of the invoice record to update.
       * @param updateData - The data to update (partial Invoice object).
       */
      updateInvoice: async (invoiceId, updateData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.patch(`/api/v1/invoices/${invoiceId}`, {
            ...updateData,
            clientId: updateData.clientId?._id,
            projectId: updateData.projectId?._id,
          });
          const updatedInvoice: Invoice = {
            ...response.data.data.invoice,
            id: response.data.data.invoice._id,
            clientId: response.data.data.invoice.clientId,
            projectId: response.data.data.invoice.projectId,
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

      /**
       * Deletes an invoice record from the database and the store.
       * @param invoiceId - The ID of the invoice record to delete.
       */
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

      /**
       * Clears all invoice data from the store.
       */
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
