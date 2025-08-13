import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api";
import { toast } from "sonner";

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
  }) => Promise<void>;
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

      /**
       * Adds a new client to the database and updates the store.
       * @param clientData - The data for the new client.
       */
      addClient: async (clientData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/api/v1/clients", clientData);
          const newClient: Client = {
            ...response.data.data.client,
            id: response.data.data.client._id,
          };

          set((state) => ({
            clients: [newClient, ...state.clients],
            isLoading: false,
            error: null,
          }));
          toast.success("Client added successfully!");
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to add client.";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      /**
       * Fetches all clients for the authenticated user and updates the store.
       */
      getAllClients: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get("/api/v1/clients");
          const fetchedClients: Client[] = response.data.data.clients.map(
            (client: any) => ({
              ...client,
              id: client._id,
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
          const errorMessage =
            error.response?.data?.message || "Failed to load clients.";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      /**
       * Fetches a single client by ID. This primarily validates existence.
       * The UI usually accesses clients from the 'clients' array fetched by getAllClients.
       * @param clientId - The ID of the client to fetch.
       * @returns The client object or null if not found/error.
       */
      getSingleClient: async (clientId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get(`/api/v1/clients/${clientId}`);
          const fetchedClient: Client = {
            ...response.data.data.client,
            id: response.data.data.client._id,
          };

          set({
            isLoading: false,
            error: null,
          });

          return fetchedClient;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to load client details.";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      /**
       * Updates an existing client in the database and the store.
       * @param clientId - The ID of the client to update.
       * @param updateData - The data to update (partial Client object).
       */
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
          const errorMessage =
            error.response?.data?.message || "Failed to update client.";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      /**
       * Deletes a client from the database and the store.
       * @param clientId - The ID of the client to delete.
       */
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
          const errorMessage =
            error.response?.data?.message || "Failed to delete client.";
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      /**
       * Clears all client data from the store.
       */
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
