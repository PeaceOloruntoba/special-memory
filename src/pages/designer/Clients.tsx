import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiPhone,
  FiMail,
  FiMapPin,
  FiEdit,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import AddClientModal from "../../components/clients/AddClientModal";
import EditClientModal from "../../components/clients/EditClientModal";
import DeleteClientModal from "../../components/clients/DeleteClientModal";
import ToggleStatusModal from "../../components/clients/ToggleStatusModal";
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
  projects?: number;
  lastOrderDate?: string | null;
}

const Clients: React.FC = () => {
  const { clients, isLoading, error, getAllClients } = useClientStore();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddingClient, setIsAddingClient] = useState<boolean>(false);
  const [isEditingClient, setIsEditingClient] = useState<boolean>(false);
  const [isDeletingClient, setIsDeletingClient] = useState<boolean>(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
      getAllClients();
  }, []);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onClose = () => {
    setIsAddingClient(false);
    setIsEditingClient(false);
    setIsDeletingClient(false);
    setIsTogglingStatus(false);
    setSelectedClient(null);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Spinner />
          <p className="text-xl text-gray-700">Loading clients...</p>
        </div>
      </div>
    );
  }

  if (error && !clients.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 min-h-screen">
        <p className="text-xl text-red-500 mb-4">Error: {error}</p>
        <Button
          className="bg-black/90 text-white hover:bg-black/80 px-4 py-2 rounded-md cursor-pointer"
          onClick={getAllClients}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Client Management
          </h1>
          <p className="text-gray-600">
            Manage your client information and relationships
          </p>
        </div>
        <Button
          className="bg-black/90 flex items-center justify-center text-white hover:bg-black/80 transition-colors duration-200 rounded-md px-4 py-2"
          onClick={() => setIsAddingClient(true)}
        >
          <FiPlus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 h-10 w-full rounded-md flex p-2 border border-gray-300 bg-white text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
        />
      </div>

      {/* Client Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <Card
              key={client.id}
              className="hover:shadow-lg transition-shadow bg-white"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-card-foreground">
                      {client.name}
                    </CardTitle>
                    <CardDescription>
                      {client.projects === 0 || client.projects === undefined
                        ? "No active projects"
                        : `${client.projects} active projects`}
                    </CardDescription>
                  </div>
                  <Badge
                    className={`px-2 text-sm rounded-full cursor-pointer ${
                      client.status === "active"
                        ? "bg-black/90 text-white hover:bg-black/80"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                    onClick={() => {
                      setSelectedClient(client);
                      setIsTogglingStatus(true);
                    }}
                  >
                    {client.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiMail className="h-4 w-4" />
                  {client.email}
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiPhone className="h-4 w-4" />
                    {client.phone}
                  </div>
                )}
                {client.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMapPin className="h-4 w-4" />
                    {client.address}
                  </div>
                )}
                {client.notes && (
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {client.notes}
                  </p>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-gray-500">
                    Last Order Date:{" "}
                    {client.lastOrderDate === null ||
                    client.lastOrderDate === undefined
                      ? "Never ordered"
                      : new Date(client.lastOrderDate).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      className="flex rounded-md p-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setSelectedClient(client);
                        setIsEditingClient(true);
                      }}
                    >
                      <FiEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      className="flex rounded-md p-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setSelectedClient(client);
                        setIsDeletingClient(true);
                      }}
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-gray-600 col-span-full">
            No clients found.
          </p>
        )}
      </div>

      {/* Modals */}
      <AddClientModal isOpen={isAddingClient} onClose={onClose} />
      {selectedClient && (
        <>
          <EditClientModal
            isOpen={isEditingClient}
            onClose={onClose}
            client={selectedClient}
          />
          <DeleteClientModal
            isOpen={isDeletingClient}
            onClose={onClose}
            client={{ id: selectedClient.id, name: selectedClient.name }}
          />
          <ToggleStatusModal
            isOpen={isTogglingStatus}
            onClose={onClose}
            client={{
              id: selectedClient.id,
              name: selectedClient.name,
              status: selectedClient.status,
            }}
          />
        </>
      )}
    </div>
  );
};

export default Clients;
