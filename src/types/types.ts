export interface Client {
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

export interface Project {
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

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

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
