import React from "react";
import { FiX } from "react-icons/fi";
import Button from "../ui/Button";
import { useMeasurementStore } from "../../store/useMeasurementStore";
import { useClientStore } from "../../store/useClientStore";
import Spinner from "../ui/Spinner";

interface DeleteMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  measurement: { id: string; clientId: string; garmentType: string };
}

const DeleteMeasurementModal: React.FC<DeleteMeasurementModalProps> = ({
  isOpen,
  onClose,
  measurement,
}) => {
  const { clients } = useClientStore();
  const { deleteMeasurement, isLoading } = useMeasurementStore();
  const client = clients.find((c) => c.id === measurement.clientId);
  const clientName = client ? client.name : "Unknown Client";

  const handleDeleteMeasurement = async () => {
    try {
      await deleteMeasurement(measurement.id);
      onClose();
    } catch (error) {
      // Error handling via store toast
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Delete Measurement
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
          Are you sure you want to delete the {measurement.garmentType}{" "}
          measurement for {clientName}? This action cannot be undone.
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
            className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md cursor-pointer"
            onClick={handleDeleteMeasurement}
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "Delete Measurement"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMeasurementModal;
