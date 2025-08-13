export interface Invoice {
  id: string;
  userId: string;
  clientId: string;
  projectId?: string;
  invoiceNumber: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  dueDate: string;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
  // NEW: Optional client and project details for enriched invoices
  client?: Client;
  project?: Project;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  address?: string; // Made optional
  phone?: string; // Made optional
  status: "active" | "inactive"; // Added specific enum for consistency
  notes?: string; // Made optional
  createdAt: string;
  updatedAt: string;
  projects?: number; // Added for frontend display
  lastOrderDate?: string | null; // Added for frontend display
}

export interface Project {
  id: string;
  userId: string; // Added, as it's typically part of the project model
  clientId: string; // Added, as it's typically part of the project model
  name: string;
  description?: string; // Made optional
  type?: string; // Made optional, or define specific types
  status?: "planning" | "in-progress" | "review" | "completed"; // Added specific enum
  priority?: "low" | "medium" | "high"; // Added specific enum
  budget?: number; // Made optional
  progress?: number; // Made optional
  dueDate?: string; // Made optional
  createdAt: string;
  updatedAt: string;
  // Optionally, you might have clientName here if populated by backend
  clientName?: string;
}

export interface CalendarEvent {
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
