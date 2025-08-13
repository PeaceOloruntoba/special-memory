"use client";

import { useState } from "react";
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
import type { InvoiceItem } from "../../types/types";

interface AddInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddInvoiceModal: React.FC<AddInvoiceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addInvoice } = useInvoiceStore();
  const { clients, isLoading: clientsLoading } = useClientStore();
  const { projects, isLoading: projectsLoading } = useProjectStore();
  const [formData, setFormData] = useState<{
    clientId: string | null;
    projectId: string | null;
    invoiceNumber: string;
    dueDate: string;
    items: InvoiceItem[];
  }>({
    clientId: null,
    projectId: null,
    invoiceNumber: "",
    dueDate: "",
    items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
  });

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

  const handleAddInvoice = async () => {
    if (!formData.clientId) return;
    try {
      await addInvoice({
        clientId: formData.clientId,
        projectId: formData.projectId || undefined,
        invoiceNumber: formData.invoiceNumber,
        dueDate: formData.dueDate,
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
          Add Invoice
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Create a new invoice for a client.
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="clientId">Client</Label>
              <Select
                value={formData.clientId || ""}
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    clientId: value || null,
                  });
                }}
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
            <div className="space-y-2 w-full">
              <Label htmlFor="projectId">Project (Optional)</Label>
              <Select
                value={formData.projectId || ""}
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    projectId: value || null,
                  });
                }}
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
            <span className="py-4">Invoice Items</span>
            {formData.items.map((item, index) => (
              <div key={index} className="flex w-full gap-2 items-center">
                <div className="flex flex-col w-full">
                  <Label className="text-xs">Description</Label>
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                    className="flex-1 h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
                    disabled={clientsLoading || projectsLoading}
                  />
                </div>
                <div className="flex flex-col">
                  <Label className="text-xs">Qty</Label>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantity",
                        Number(e.target.value)
                      )
                    }
                    className="flex h-10 w-20 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
                    disabled={clientsLoading || projectsLoading}
                  />
                </div>
                <div className="flex flex-col">
                  <Label className="text-xs">Rate</Label>
                  <Input
                    type="number"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) =>
                      handleItemChange(index, "rate", Number(e.target.value))
                    }
                    className="flex h-10 w-20 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
                    disabled={clientsLoading || projectsLoading}
                  />
                </div>
                <div className="flex flex-col">
                  <Label className="text-xs">Amount</Label>
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={item.rate * item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "amount", Number(e.target.value))
                    }
                    className="flex h-10 w-20 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
                    disabled={clientsLoading || projectsLoading}
                  />
                </div>
                <div className="flex flex-col">
                  <Label className="text-xs">CLR</Label>
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
              </div>
            ))}
            <Button
              className="bg-black/90 text-white hover:bg-black/80 px-4 py-2 rounded-md cursor-pointer flex items-center gap-2"
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
              onClick={handleAddInvoice}
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
              Create Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInvoiceModal;
