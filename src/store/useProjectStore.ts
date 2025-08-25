import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../utils/api";
import { toast } from "sonner";
import { handleError } from "../utils/handleError";

interface Project {
  id: string;
  userId: string;
  clientId: string;
  name: string;
  description?: string;
  type: string;
  status: "planning" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high";
  progress: number;
  dueDate?: string;
  budget?: number;
  createdAt: string;
  updatedAt: string;
  clientName?: string;
}

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  addProject: (
    projectData: {
      clientId: string;
      name: string;
      description?: string;
      type: string;
      status?: "planning" | "in-progress" | "review" | "completed";
      priority?: "low" | "medium" | "high";
      progress?: number;
      dueDate?: string;
      budget?: number;
    },
    navigate: any
  ) => Promise<void>;
  getAllProjects: (clientId?: string) => Promise<void>;
  getSingleProject: (projectId: string) => Promise<Project | null>;
  updateProject: (
    projectId: string,
    updateData: Partial<Project>
  ) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  clearProjects: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, _get) => ({
      projects: [],
      isLoading: false,
      error: null,
      lastFetched: null,

      /**
       * Adds a new project record to the database and updates the store.
       * @param projectData - The data for the new project (clientId, name, etc.).
       */
      addProject: async (projectData, navigate) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post(`/api/v1/projects`, projectData);
          const newProject: Project = {
            ...response.data.data.project,
            id: response.data.data.project._id,
            clientId: response.data.data.project.clientId._id,
            clientName: response.data.data.project.clientId?.name,
          };

          set((state) => ({
            projects: [newProject, ...state.projects],
            isLoading: false,
            error: null,
          }));
          toast.success("Project added successfully!");
        } catch (error: any) {
          const { message } = handleError(error, navigate);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      /**
       * Fetches all project records for the authenticated user, optionally filtered by client, and updates the store.
       * @param clientId (optional) - If provided, fetches projects only for this specific client.
       */
      getAllProjects: async (clientId?: string) => {
        set({ isLoading: true, error: null });
        try {
          const url = clientId
            ? `/api/v1/projects/${clientId}`
            : "/api/v1/projects";
          const response = await api.get(url);
          const fetchedProjects: Project[] = response.data.data.projects.map(
            (p: any) => ({
              ...p,
              id: p._id,
              clientId: p.clientId?._id,
              clientName: p.clientId?.name,
            })
          );

          set({
            projects: fetchedProjects,
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
          });
          toast.success("Projects loaded successfully!");
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      /**
       * Fetches a single project record by its ID.
       * @param projectId - The ID of the project record to fetch.
       * @returns The project object or null if not found/error.
       */
      getSingleProject: async (projectId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get(`/api/v1/projects/${projectId}`);
          const fetchedProject: Project = {
            ...response.data.data.project,
            id: response.data.data.project._id,
            clientId: response.data.data.project.clientId?._id,
            clientName: response.data.data.project.clientId?.name,
          };

          set({ isLoading: false, error: null });
          return fetchedProject;
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      /**
       * Updates an existing project record in the database and the store.
       * @param projectId - The ID of the project record to update.
       * @param updateData - The data to update (partial Project object).
       */
      updateProject: async (projectId, updateData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.patch(
            `/api/v1/projects/${projectId}`,
            updateData
          );
          const updatedProject: Project = {
            ...response.data.data.project,
            id: response.data.data.project._id,
            clientId: response.data.data.project.clientId?._id,
            clientName: response.data.data.project.clientId?.name,
          };

          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === projectId ? updatedProject : p
            ),
            isLoading: false,
            error: null,
          }));
          toast.success("Project updated successfully!");
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      /**
       * Deletes a project record from the database and the store.
       * @param projectId - The ID of the project record to delete.
       */
      deleteProject: async (projectId) => {
        set({ isLoading: true, error: null });
        try {
          await api.delete(`/api/v1/projects/${projectId}`);

          set((state) => ({
            projects: state.projects.filter((p) => p.id !== projectId),
            isLoading: false,
            error: null,
          }));
          toast.success("Project deleted successfully!");
        } catch (error: any) {
          const { message } = handleError(error);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      /**
       * Clears all project data from the store.
       */
      clearProjects: () => {
        set({ projects: [], isLoading: false, error: null, lastFetched: null });
      },
    }),
    {
      name: "project-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        projects: state.projects,
        lastFetched: state.lastFetched,
      }),
      version: 1,
    }
  )
);
