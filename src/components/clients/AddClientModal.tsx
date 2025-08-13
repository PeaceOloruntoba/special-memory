import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Label from "../ui/Label";
import Textarea from "../ui/Textarea";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  status: "active" | "inactive";
  projects: number;
  lastOrder: string;
}

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (client: Client) => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({
  isOpen,
  onClose,
  onAddClient,
}) => {
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const handleAddClient = () => {
    const client: Client = {
      id: Date.now().toString(),
      ...newClient,
      status: "active",
      projects: 0,
      lastOrder: new Date().toISOString().split("T")[0],
    };
    onAddClient(client);
    setNewClient({ name: "", email: "", phone: "", address: "", notes: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Add New Client
          </h2>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <FiX className="h-4 w-4 text-gray-600" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Enter the client's information to add them to your database.
        </p>
        <div className="mt-4 flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newClient.name}
              onChange={(e) =>
                setNewClient({ ...newClient, name: e.target.value })
              }
              placeholder="Client's full name"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newClient.email}
              onChange={(e) =>
                setNewClient({ ...newClient, email: e.target.value })
              }
              placeholder="client@email.com"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={newClient.phone}
              onChange={(e) =>
                setNewClient({ ...newClient, phone: e.target.value })
              }
              placeholder="+1 (555) 123-4567"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={newClient.address}
              onChange={(e) =>
                setNewClient({ ...newClient, address: e.target.value })
              }
              placeholder="Street address"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={newClient.notes}
              onChange={(e) =>
                setNewClient({ ...newClient, notes: e.target.value })
              }
              placeholder="Any special notes about the client..."
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            className="border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-md cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-black/90 text-white hover:bg-black/80 px-4 py-2 rounded-md cursor-pointer"
            onClick={handleAddClient}
          >
            Add Client
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddClientModal;
