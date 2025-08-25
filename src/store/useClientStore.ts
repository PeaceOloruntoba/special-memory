import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api";
import { toast } from "sonner";
import { handleError } from "../utils/handleError";

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  projects?: number;
  lastOrderDate?: string | null;
}

interface ClientState {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  addClient: (clientData: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    notes?: string;
  }, navigate: any) => Promise<void>;
  getAllClients: () => Promise<void>;
  getSingleClient: (clientId: string) => Promise<Client | null>;
  updateClient: (
    clientId: string,
    updateData: Partial<Client>
  ) => Promise<void>;
  deleteClient: (clientId: string) => Promise<void>;
  clearClients: () => void;
}

export const useClientStore = create<ClientState>()(
  persist(
    (set, _get) => ({
      clients: [],
      isLoading: false,
      error: null,
      lastFetched: null,

      addClient: async (clientData, navigate) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/api/v1/clients", clientData);
          const newClient: Client = {
            ...response.data.data.client,
            id: response.data.data.client._id,

            projects: response.data.data.client.projects || 0,
            lastOrderDate: response.data.data.client.lastOrderDate || null,
          };

          set((state) => ({
            clients: [newClient, ...state.clients],
            isLoading: false,
            error: null,
          }));
          toast.success("Client added successfully!");
        } catch (error: any) {
          console.log(error)
          const { message } = handleError(error, navigate);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      getAllClients: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get("/api/v1/clients");
          const fetchedClients: Client[] = response.data.data.clients.map(
            (client: any) => ({
              ...client,
              id: client._id,
              projects: client.projects || 0,
              lastOrderDate: client.lastOrderDate || null,
            })
          );

          set({
            clients: fetchedClients,
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
          });
          toast.success("Clients loaded successfully!");
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      getSingleClient: async (clientId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get(`/api/v1/clients/${clientId}`);
          const fetchedClient: Client = {
            ...response.data.data.client,
            id: response.data.data.client._id,
            projects: response.data.data.client.projects || 0,
            lastOrderDate: response.data.data.client.lastOrderDate || null,
          };

          set({ isLoading: false, error: null });
          return fetchedClient;
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      updateClient: async (clientId, updateData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.patch(
            `/api/v1/clients/${clientId}`,
            updateData
          );
          const updatedClient: Client = {
            ...response.data.data.client,
            id: response.data.data.client._id,
            projects: response.data.data.client.projects || 0,
            lastOrderDate: response.data.data.client.lastOrderDate || null,
          };

          set((state) => ({
            clients: state.clients.map((client) =>
              client.id === clientId ? updatedClient : client
            ),
            isLoading: false,
            error: null,
          }));
          toast.success("Client updated successfully!");
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      deleteClient: async (clientId) => {
        set({ isLoading: true, error: null });
        try {
          await api.delete(`/api/v1/clients/${clientId}`);

          set((state) => ({
            clients: state.clients.filter((client) => client.id !== clientId),
            isLoading: false,
            error: null,
          }));
          toast.success("Client deleted successfully!");
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      clearClients: () => {
        set({ clients: [], isLoading: false, error: null, lastFetched: null });
      },
    }),
    {
      name: "client-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        clients: state.clients,
        lastFetched: state.lastFetched,
      }),
      version: 1,
    }
  )
);
