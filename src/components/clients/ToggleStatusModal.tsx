import React from "react";
import { FiX } from "react-icons/fi";
import Button from "../ui/Button";
import { useClientStore } from "../../store/useClientStore";
import Spinner from "../ui/Spinner";

interface ToggleStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: { id: string; name: string; status: "active" | "inactive" };
}

const ToggleStatusModal: React.FC<ToggleStatusModalProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  const { updateClient, isLoading } = useClientStore();
  const newStatus = client.status === "active" ? "inactive" : "active";

  const handleToggleStatus = async () => {
    try {
      await updateClient(client.id, { status: newStatus });
      onClose();
    } catch (error) {
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Toggle Client Status
          </h2>
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
          Are you sure you want to change the status of {client.name} to{" "}
          {newStatus}?
        </p>
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
            onClick={handleToggleStatus}
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : `Set to ${newStatus}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ToggleStatusModal;
