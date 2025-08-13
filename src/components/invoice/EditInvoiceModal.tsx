"use client";

import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import { useInvoiceStore } from "../../store/useInvoiceStore";
import { useClientStore } from "../../store/useClientStore";
import { useProjectStore } from "../../store/useProjectStore";
import { FiPlus, FiMinus } from "react-icons/fi";

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
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
  clientName?: string;
  projectName?: string;
}

interface EditInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
}

const EditInvoiceModal: React.FC<EditInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
}) => {
  const { updateInvoice } = useInvoiceStore();
  const { clients, isLoading: clientsLoading } = useClientStore();
  const { projects, isLoading: projectsLoading } = useProjectStore();
  const [formData, setFormData] = useState({
    clientId: invoice.clientId,
    projectId: invoice.projectId || "",
    invoiceNumber: invoice.invoiceNumber,
    dueDate: invoice.dueDate,
    status: invoice.status,
    items: invoice.items,
  });

  useEffect(() => {
    setFormData({
      clientId: invoice.clientId,
      projectId: invoice.projectId || "",
      invoiceNumber: invoice.invoiceNumber,
      dueDate: invoice.dueDate,
      status: invoice.status,
      items: invoice.items,
    });
  }, [invoice]);

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { description: "", quantity: 1, rate: 0, amount: 0 },
      ],
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === "quantity" || field === "rate") {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    setFormData({ ...formData, items: newItems });
  };

  const handleUpdateInvoice = async () => {
    try {
      await updateInvoice(invoice.id, {
        clientId: formData.clientId,
        projectId: formData.projectId || undefined,
        invoiceNumber: formData.invoiceNumber,
        dueDate: formData.dueDate,
        status: formData.status,
        items: formData.items,
      });
      onClose();
    } catch (error) {
      // Error handled via store toast
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Edit Invoice
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Update the details for the invoice.
        </p>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientId">Client</Label>
            <Select
              value={formData.clientId}
              onValueChange={(value) =>
                setFormData({ ...formData, clientId: value })
              }
              disabled={clientsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectId">Project (Optional)</Label>
            <Select
              value={formData.projectId}
              onValueChange={(value) =>
                setFormData({ ...formData, projectId: value })
              }
              disabled={projectsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Project</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={(e) =>
                setFormData({ ...formData, invoiceNumber: e.target.value })
              }
              placeholder="e.g., INV-001"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              disabled={clientsLoading || projectsLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              disabled={clientsLoading || projectsLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  status: value as "draft" | "sent" | "paid" | "overdue",
                })
              }
              disabled={clientsLoading || projectsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Items</Label>
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                  className="flex-1"
                  disabled={clientsLoading || projectsLoading}
                />
                <Input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", Number(e.target.value))
                  }
                  className="w-20"
                  disabled={clientsLoading || projectsLoading}
                />
                <Input
                  type="number"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) =>
                    handleItemChange(index, "rate", Number(e.target.value))
                  }
                  className="w-24"
                  disabled={clientsLoading || projectsLoading}
                />
                <Button
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 p-2 rounded-md cursor-pointer"
                  onClick={() => handleRemoveItem(index)}
                  disabled={
                    formData.items.length === 1 ||
                    clientsLoading ||
                    projectsLoading
                  }
                >
                  <FiMinus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              className="bg-black/90 text-white hover:bg-black/80 px-4 py-2 rounded-md cursor-pointer"
              onClick={handleAddItem}
              disabled={clientsLoading || projectsLoading}
            >
              <FiPlus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              className="border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-md cursor-pointer"
              onClick={onClose}
              disabled={clientsLoading || projectsLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-black/90 text-white hover:bg-black/80 px-4 py-2 rounded-md cursor-pointer"
              onClick={handleUpdateInvoice}
              disabled={
                clientsLoading ||
                projectsLoading ||
                !formData.clientId ||
                !formData.invoiceNumber ||
                !formData.dueDate ||
                formData.items.some(
                  (item) => !item.description || !item.quantity || !item.rate
                )
              }
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInvoiceModal;
