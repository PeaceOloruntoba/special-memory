import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Label from "../ui/Label";
import Textarea from "../ui/Textarea";
import { useClientStore } from "../../store/useClientStore";

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

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

const EditClientModal: React.FC<EditClientModalProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  const [editedClient, setEditedClient] = useState<Client>({ ...client });
  const { updateClient, isLoading } = useClientStore();

  const handleEditClient = async () => {
    try {
      await updateClient(client.id, {
        name: editedClient.name,
        email: editedClient.email,
        phone: editedClient.phone || undefined,
        address: editedClient.address || undefined,
        notes: editedClient.notes || undefined,
      });
      onClose();
    } catch (error) {
      // Error handling is managed by the store via toast notifications
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Edit Client</h2>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={isLoading}
          >
            <FiX className="h-4 w-4 text-gray-600" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Update the client's information.
        </p>
        <div className="mt-4 flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={editedClient.name}
              onChange={(e) =>
                setEditedClient({ ...editedClient, name: e.target.value })
              }
              placeholder="Client's full name"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={editedClient.email}
              onChange={(e) =>
                setEditedClient({ ...editedClient, email: e.target.value })
              }
              placeholder="client@email.com"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={editedClient.phone || ""}
              onChange={(e) =>
                setEditedClient({ ...editedClient, phone: e.target.value })
              }
              placeholder="+1 (555) 123-4567"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={editedClient.address || ""}
              onChange={(e) =>
                setEditedClient({ ...editedClient, address: e.target.value })
              }
              placeholder="Street address"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={editedClient.notes || ""}
              onChange={(e) =>
                setEditedClient({ ...editedClient, notes: e.target.value })
              }
              placeholder="Any special notes about the client..."
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            className="border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-md cursor-pointer"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="bg-black/90 text-white hover:bg-black/80 px-4 py-2 rounded-md cursor-pointer"
            onClick={handleEditClient}
            disabled={isLoading}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditClientModal;
