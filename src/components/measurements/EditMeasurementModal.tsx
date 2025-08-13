import React, { useState } from "react";
import { FiX, FiPlus } from "react-icons/fi";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Label from "../ui/Label";
import Textarea from "../ui/Textarea";
import { useMeasurementStore } from "../../store/useMeasurementStore";
import { useClientStore } from "../../store/useClientStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";

interface MeasurementDetail {
  name: string;
  size: number;
  unit?: string;
}

interface Measurement {
  id: string;
  clientId: string;
  garmentType: string;
  measurements: MeasurementDetail[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const measurementTemplates: Record<string, string[]> = {
  dress: [
    "Bust",
    "Waist",
    "Hips",
    "Shoulder Width",
    "Arm Length",
    "Dress Length",
    "Back Width",
    "Front Length",
    "Back Length",
    "Neck Circumference",
    "Armhole",
  ],
  suit: [
    "Chest",
    "Waist",
    "Hips",
    "Shoulder Width",
    "Arm Length",
    "Jacket Length",
    "Trouser Waist",
    "Trouser Length",
    "Inseam",
    "Neck",
    "Cuff",
  ],
  shirt: [
    "Chest",
    "Waist",
    "Shoulder Width",
    "Arm Length",
    "Neck",
    "Shirt Length",
    "Cuff",
    "Bicep",
    "Collar",
  ],
  pants: [
    "Waist",
    "Hips",
    "Inseam",
    "Outseam",
    "Thigh",
    "Knee",
    "Ankle",
    "Rise",
  ],
  skirt: ["Waist", "Hips", "Skirt Length", "Hem Circumference", "Waist to Hip"],
  blouse: [
    "Bust",
    "Waist",
    "Shoulder Width",
    "Arm Length",
    "Blouse Length",
    "Armhole",
    "Neck",
  ],
  jacket: [
    "Chest",
    "Waist",
    "Shoulder Width",
    "Arm Length",
    "Jacket Length",
    "Back Width",
    "Sleeve Width",
  ],
};

interface EditMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  measurement: Measurement;
}

const EditMeasurementModal: React.FC<EditMeasurementModalProps> = ({
  isOpen,
  onClose,
  measurement,
}) => {
  const { clients } = useClientStore();
  const { updateMeasurement, isLoading } = useMeasurementStore();
  const [clientId, setClientId] = useState(measurement.clientId);
  const [garmentType, setGarmentType] = useState(measurement.garmentType);
  const [measurements, setMeasurements] = useState<Record<string, number>>(
    measurement.measurements.reduce(
      (acc, m) => ({ ...acc, [m.name]: m.size }),
      {}
    )
  );
  const [customMeasurements, setCustomMeasurements] = useState<
    { name: string; size: string }[]
  >(
    measurement.measurements
      .filter(
        (m) => !measurementTemplates[measurement.garmentType]?.includes(m.name)
      )
      .map((m) => ({ name: m.name, size: m.size.toString() }))
  );
  const [notes, setNotes] = useState(measurement.notes || "");

  const handleMeasurementChange = (field: string, value: string) => {
    setMeasurements((prev) => ({
      ...prev,
      [field]: Number.parseFloat(value) || 0,
    }));
  };

  const handleCustomMeasurementChange = (
    index: number,
    field: "name" | "size",
    value: string
  ) => {
    setCustomMeasurements((prev) =>
      prev.map((cm, i) => (i === index ? { ...cm, [field]: value } : cm))
    );
  };

  const addCustomMeasurement = () => {
    setCustomMeasurements((prev) => [...prev, { name: "", size: "" }]);
  };

  const removeCustomMeasurement = (index: number) => {
    setCustomMeasurements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditMeasurement = async () => {
    try {
      const measurementDetails: MeasurementDetail[] = [
        ...Object.entries(measurements)
          .filter(([, size]) => size > 0)
          .map(([name, size]) => ({ name, size, unit: "inches" })),
        ...customMeasurements
          .filter((cm) => cm.name && Number.parseFloat(cm.size) > 0)
          .map((cm) => ({
            name: cm.name,
            size: Number.parseFloat(cm.size),
            unit: "inches",
          })),
      ];
      await updateMeasurement(measurement.id, {
        clientId,
        garmentType,
        measurements: measurementDetails,
        notes: notes || undefined,
      });
      onClose();
    } catch (error) {
      // Error handling via store toast
    }
  };

  if (!isOpen) return null;

  const currentTemplate = garmentType
    ? measurementTemplates[garmentType] || []
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-4/5 rounded-lg bg-white p-6 shadow-lg h-4/5 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Measurement
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
          Update the measurement details for the selected client and garment.
        </p>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="client">Client</Label>
              <Select
                value={clientId}
                onValueChange={setClientId}
                disabled={true}
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
              <Label htmlFor="garmentType">Garment Type</Label>
              <Select
                value={garmentType}
                onValueChange={setGarmentType}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select garment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dress">Dress</SelectItem>
                  <SelectItem value="suit">Suit</SelectItem>
                  <SelectItem value="shirt">Shirt</SelectItem>
                  <SelectItem value="pants">Pants</SelectItem>
                  <SelectItem value="skirt">Skirt</SelectItem>
                  <SelectItem value="blouse">Blouse</SelectItem>
                  <SelectItem value="jacket">Jacket</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {currentTemplate.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Measurements (inches)</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {currentTemplate.map((field) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>{field}</Label>
                    <Input
                      id={field}
                      type="number"
                      step="0.25"
                      placeholder="0.00"
                      value={measurements[field] || ""}
                      onChange={(e) =>
                        handleMeasurementChange(field, e.target.value)
                      }
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Custom Measurements</h3>
                {customMeasurements.map((cm, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor={`custom-name-${index}`}>Name</Label>
                      <Input
                        id={`custom-name-${index}`}
                        value={cm.name}
                        onChange={(e) =>
                          handleCustomMeasurementChange(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="e.g., Shoulder Slope"
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`custom-size-${index}`}>
                        Size (inches)
                      </Label>
                      <Input
                        id={`custom-size-${index}`}
                        type="number"
                        step="0.25"
                        value={cm.size}
                        onChange={(e) =>
                          handleCustomMeasurementChange(
                            index,
                            "size",
                            e.target.value
                          )
                        }
                        placeholder="0.00"
                        className="flex h-10 w-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
                        disabled={isLoading}
                      />
                    </div>
                    <Button
                      className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 p-2"
                      onClick={() => removeCustomMeasurement(index)}
                      disabled={isLoading}
                    >
                      <FiX className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  className="bg-gray-100 text-gray-900 hover:bg-gray-200 px-4 py-2 rounded-md cursor-pointer"
                  onClick={addCustomMeasurement}
                  disabled={isLoading}
                >
                  <FiPlus className="h-4 w-4 mr-2" />
                  Add Custom Measurement
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special notes about the measurements..."
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              className="border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-md cursor-pointer"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-black/90 text-white hover:bg-black/80 px-4 py-2 rounded-md cursor-pointer"
              onClick={handleEditMeasurement}
              disabled={isLoading || !clientId || !garmentType}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMeasurementModal;
