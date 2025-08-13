import React, { useEffect, useState } from "react";
import { FiSearch, FiEdit, FiTrash2 } from "react-icons/fi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import Textarea from "../../components/ui/Textarea";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import { useMeasurementStore } from "../../store/useMeasurementStore";
import { useClientStore } from "../../store/useClientStore";
import EditMeasurementModal from "../../components/measurements/EditMeasurementModal";
import DeleteMeasurementModal from "../../components/measurements/DeleteMeasurementModal";
import { LuRuler } from "react-icons/lu";

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

const Measurements: React.FC = () => {
  const { measurements, isLoading, error, getAllMeasurements, addMeasurement } =
    useMeasurementStore();
  const { clients, getAllClients } = useClientStore();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"view" | "add">("view");
  const [isEditingMeasurement, setIsEditingMeasurement] =
    useState<boolean>(false);
  const [isDeletingMeasurement, setIsDeletingMeasurement] =
    useState<boolean>(false);
  const [selectedMeasurement, setSelectedMeasurement] =
    useState<Measurement | null>(null);
  const [clientId, setClientId] = useState("");
  const [garmentType, setGarmentType] = useState("");
  const [measurementsForm, setMeasurementsForm] = useState<
    Record<string, number>
  >({});
  const [customMeasurements, setCustomMeasurements] = useState<
    { name: string; size: string }[]
  >([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    getAllClients();
    getAllMeasurements();
  }, []);

  const filteredMeasurements = measurements.filter((measurement) => {
    const client = clients.find((c) => c.id === measurement.clientId);
    const clientName = client ? client.name.toLowerCase() : "";
    return (
      clientName.includes(searchTerm.toLowerCase()) ||
      measurement.garmentType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleMeasurementChange = (field: string, value: string) => {
    setMeasurementsForm((prev) => ({
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

  const handleAddMeasurement = async () => {
    try {
      const measurementDetails: MeasurementDetail[] = [
        ...Object.entries(measurementsForm)
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
      await addMeasurement({
        clientId,
        garmentType,
        measurements: measurementDetails,
        notes: notes || undefined,
      });
      setClientId("");
      setGarmentType("");
      setMeasurementsForm({});
      setCustomMeasurements([]);
      setNotes("");
      setActiveTab("view");
    } catch (error) {
      // Error handling via store toast
    }
  };

  const resetForm = () => {
    setClientId("");
    setGarmentType("");
    setMeasurementsForm({});
    setCustomMeasurements([]);
    setNotes("");
  };

  if (isLoading && !measurements.length && !clients.length) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Spinner />
          <p className="text-xl text-gray-700">Loading measurements...</p>
        </div>
      </div>
    );
  }

  if (error && !measurements.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 min-h-screen">
        <p className="text-xl text-red-500 mb-4">Error: {error}</p>
        <Button
          className="bg-black/90 text-white hover:bg-black/80 px-4 py-2 rounded-md cursor-pointer"
          onClick={() => {
            getAllClients();
            getAllMeasurements();
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  const currentTemplate = garmentType
    ? measurementTemplates[garmentType] || []
    : [];

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Measurements</h1>
          <p className="text-gray-600">Record and manage client measurements</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex">
        <Button
          className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
            activeTab === "add"
              ? "bg-white text-gray-800 border border-gray-200"
              : "text-black/70"
          }`}
          onClick={() => setActiveTab("add")}
        >
          New Measurement
        </Button>
        <Button
          className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
            activeTab === "view"
              ? "bg-white text-gray-800 border border-gray-200"
              : "text-black/70"
          }`}
          onClick={() => {
            setActiveTab("view");
            resetForm();
          }}
        >
          Measurement History
        </Button>
      </div>

      {/* View Measurements Tab */}
      {activeTab === "view" && (
        <>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search measurements by client or garment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 h-10 w-full rounded-md flex p-2 border border-gray-300 bg-white text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
            />
          </div>

          <div className="flex flex-col gap-3">
            {filteredMeasurements.length > 0 ? (
              filteredMeasurements.map((measurement) => {
                const client = clients.find(
                  (c) => c.id === measurement.clientId
                );
                const clientName = client ? client.name : "Unknown Client";
                return (
                  <Card
                    key={measurement.id}
                    className="hover:shadow-lg transition-shadow bg-white"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-card-foreground">
                            {clientName}
                          </CardTitle>
                          <CardDescription>
                            Recorded on{" "}
                            {new Date(
                              measurement.createdAt
                            ).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge className="px-2 text-sm rounded-full bg-black/90 text-white">
                          {measurement.garmentType}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                        {measurement.measurements.map((m) => (
                          <div key={m.name}>
                            <span className="font-medium">{m.name}:</span>
                            {m.size} {m.unit == "inches" ? '"' : 'cm'}
                          </div>
                        ))}
                      </div>
                      {measurement.notes && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {measurement.notes}
                        </p>
                      )}
                      <div className="flex justify-end gap-2 pt-2">
                        <Button
                          className="flex rounded-md p-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            setSelectedMeasurement(measurement);
                            setIsEditingMeasurement(true);
                          }}
                        >
                          <FiEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          className="flex rounded-md p-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            setSelectedMeasurement(measurement);
                            setIsDeletingMeasurement(true);
                          }}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <p className="text-sm text-gray-600 col-span-full">
                No measurements found.
              </p>
            )}
          </div>
        </>
      )}

      {/* Add Measurement Tab */}
      {activeTab === "add" && (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full mx-auto">
          <h2 className="md:text-2xl font-semibold text-gray-900 mb-4 text-lg">
            <LuRuler className="inline-block mr-2 w-6 h-6" />
            Record New Measurements
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Select a client and garment type to begin recording measurements
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="space-y-2 w-full">
                <Label htmlFor="client">Client</Label>
                <Select
                  value={clientId}
                  onValueChange={setClientId}
                  disabled={isLoading}
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
              <div className="space-y-4 pt-2">
                <h3 className="md:text-xl text-md font-semibold">Measurements (inches)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentTemplate.map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>{field}</Label>
                      <Input
                        id={field}
                        type="number"
                        step="0.25"
                        placeholder="0.00"
                        value={measurementsForm[field] || ""}
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
                        <FiTrash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    className="bg-gray-100 text-gray-900 hover:bg-gray-200 px-4 py-2 rounded-md cursor-pointer"
                    onClick={addCustomMeasurement}
                    disabled={isLoading}
                  >
                    <FiEdit className="h-4 w-4 mr-2" />
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
                onClick={() => {
                  setActiveTab("view");
                  resetForm();
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="bg-black/90 text-white hover:bg-black/80 px-4 py-2 rounded-md cursor-pointer"
                onClick={handleAddMeasurement}
                disabled={isLoading || !clientId || !garmentType}
              >
                Save Measurement
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedMeasurement && (
        <>
          <EditMeasurementModal
            isOpen={isEditingMeasurement}
            onClose={() => {
              setIsEditingMeasurement(false);
              setSelectedMeasurement(null);
            }}
            measurement={selectedMeasurement}
          />
          <DeleteMeasurementModal
            isOpen={isDeletingMeasurement}
            onClose={() => {
              setIsDeletingMeasurement(false);
              setSelectedMeasurement(null);
            }}
            measurement={{
              id: selectedMeasurement.id,
              clientId: selectedMeasurement.clientId,
              garmentType: selectedMeasurement.garmentType,
            }}
          />
        </>
      )}
    </div>
  );
};

export default Measurements;
