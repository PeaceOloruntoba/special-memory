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
  address: string;
  phone: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  budget: number;
  progress: number;
  dueDate: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
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
