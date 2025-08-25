import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api";
import { toast } from "sonner";
import { handleError } from "../utils/handleError";

interface CalendarEvent {
  id: string;
  userId: string;
  clientId?: string;
  title: string;
  description?: string;
  type:
    | "fitting"
    | "consultation"
    | "delivery"
    | "deadline"
    | "meeting"
    | "other";
  startTime: string;
  endTime: string;
  location?: string;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;

  clientName?: string;
}

interface CalendarState {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  errorCode: string | null;
  featureLocked: boolean;
  lastFetched: number | null;

  addEvent: (eventData: {
    clientId?: string;
    title: string;
    description?: string;
    type:
      | "fitting"
      | "consultation"
      | "delivery"
      | "deadline"
      | "meeting"
      | "other";
    startTime: string;
    endTime: string;
    location?: string;
    status?: "scheduled" | "completed" | "cancelled";
  }) => Promise<void>;
  getAllEvents: (filterOptions?: {
    clientId?: string;
    startDate?: string;
    endDate?: string;
  }) => Promise<void>;
  getSingleEvent: (eventId: string) => Promise<CalendarEvent | null>;
  updateEvent: (
    eventId: string,
    updateData: Partial<CalendarEvent>
  ) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  clearEvents: () => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, _get) => ({
      events: [],
      isLoading: false,
      error: null,
      errorCode: null,
      featureLocked: false,
      lastFetched: null,

      /**
       * Adds a new calendar event record to the database and updates the store.
       * @param eventData - The data for the new event.
       */
      addEvent: async (eventData) => {
        set({ isLoading: true, error: null, errorCode: null });
        try {
          const response = await api.post("/api/v1/calendar", eventData);
          const newEvent: CalendarEvent = {
            ...response.data.data.event,
            id: response.data.data.event._id,
            clientName: response.data.data.event.clientId?.name,
          };

          set((state) => ({
            events: [newEvent, ...state.events],
            isLoading: false,
            error: null,
            errorCode: null,
            featureLocked: false,
          }));
          toast.success("Event added successfully!");
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, errorCode: null, isLoading: false });
          throw error;
        }
      },

      /**
       * Fetches all calendar event records for the authenticated user, optionally filtered, and updates the store.
       * @param filterOptions - An object containing optional clientId, startDate, or endDate for filtering.
       */
      getAllEvents: async (filterOptions) => {
        set({ isLoading: true, error: null, errorCode: null });
        try {
          let url = "/api/v1/calendar";
          const queryParams = new URLSearchParams();

          if (filterOptions?.clientId) {
            url = `/api/v1/clients/${filterOptions.clientId}/calendar`;
          }

          if (filterOptions?.startDate) {
            queryParams.append("startDate", filterOptions.startDate);
          }
          if (filterOptions?.endDate) {
            queryParams.append("endDate", filterOptions.endDate);
          }
          if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
          }

          const response = await api.get(url);
          const fetchedEvents: CalendarEvent[] = response.data.data.events.map(
            (e: any) => ({
              ...e,
              id: e._id,
              clientName: e.clientId?.name,
            })
          );

          set({
            events: fetchedEvents,
            isLoading: false,
            error: null,
            errorCode: null,
            featureLocked: false,
            lastFetched: Date.now(),
          });
          toast.success("Calendar events loaded successfully!");
        } catch (error: any) {          
          if (error?.status === 403) {
            const msg = "You need to upgrade to a higher plan to use this feature...";
            toast.error(msg);
            set({
              error: msg,
              errorCode: "PLAN_UPGRADE_REQUIRED",
              featureLocked: true,
              isLoading: false,
            });
            return;
          }
          const { message } = handleError(error);
          set({ error: message, errorCode: null, isLoading: false });
          throw error;
        }
      },

      /**
       * Fetches a single calendar event record by its ID.
       * @param eventId - The ID of the event record to fetch.
       * @returns The event object or null if not found/error.
       */
      getSingleEvent: async (eventId) => {
        set({ isLoading: true, error: null, errorCode: null });
        try {
          const response = await api.get(`/api/v1/calendar/${eventId}`);
          const fetchedEvent: CalendarEvent = {
            ...response.data.data.event,
            id: response.data.data.event._id,
            clientName: response.data.data.event.clientId?.name,
          };

          set({ isLoading: false, error: null, errorCode: null });
          return fetchedEvent;
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, errorCode: null, isLoading: false });
          throw error;
        }
      },

      /**
       * Updates an existing calendar event record in the database and the store.
       * @param eventId - The ID of the event record to update.
       * @param updateData - The data to update (partial CalendarEvent object).
       */
      updateEvent: async (eventId, updateData) => {
        set({ isLoading: true, error: null, errorCode: null });
        try {
          const response = await api.patch(
            `/api/v1/calendar/${eventId}`,
            updateData
          );
          const updatedEvent: CalendarEvent = {
            ...response.data.data.event,
            id: response.data.data.event._id,
            clientName: response.data.data.event.clientId?.name,
          };

          set((state) => ({
            events: state.events.map((e) =>
              e.id === eventId ? updatedEvent : e
            ),
            isLoading: false,
            error: null,
            errorCode: null,
            featureLocked: false,
          }));
          toast.success("Event updated successfully!");
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, errorCode: null, isLoading: false });
          throw error;
        }
      },

      /**
       * Deletes a calendar event record from the database and the store.
       * @param eventId - The ID of the event record to delete.
       */
      deleteEvent: async (eventId) => {
        set({ isLoading: true, error: null, errorCode: null });
        try {
          await api.delete(`/api/v1/calendar/${eventId}`);

          set((state) => ({
            events: state.events.filter((e) => e.id !== eventId),
            isLoading: false,
            error: null,
            errorCode: null,
            featureLocked: false,
          }));
          toast.success("Event deleted successfully!");
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, errorCode: null, isLoading: false });
          throw error;
        }
      },

      /**
       * Clears all calendar event data from the store.
       */
      clearEvents: () => {
        set({
          events: [],
          isLoading: false,
          error: null,
          errorCode: null,
          featureLocked: false,
          lastFetched: null,
        });
      },
    }),
    {
      name: "calendar-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        events: state.events,
        lastFetched: state.lastFetched,
      }),
      version: 1,
    }
  )
);
