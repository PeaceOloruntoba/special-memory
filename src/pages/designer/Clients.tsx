import React, { useState } from "react";
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
import AddClientModal from "../../components/clients/AddClientModal";
import EditClientModal from "../../components/clients/EditClientModal";
import DeleteClientModal from "../../components/clients/DeleteClientModal";

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

const mockClients: Client[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Fashion Ave, NY 10001",
    notes: "Prefers elegant, classic styles. Size 8-10.",
    status: "inactive",
    projects: 3,
    lastOrder: "2024-01-15",
  },
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    phone: "+1 (555) 987-6543",
    address: "456 Style St, LA 90210",
    notes: "Wedding dress client. Very detail-oriented.",
    status: "active",
    projects: 1,
    lastOrder: "2024-01-20",
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma.w@email.com",
    phone: "+1 (555) 456-7890",
    address: "789 Design Blvd, Chicago 60601",
    notes: "Casual wear enthusiast. Sustainable fashion advocate.",
    status: "active",
    projects: 2,
    lastOrder: "2024-01-10",
  },
];

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddingClient, setIsAddingClient] = useState<boolean>(false);
  const [isEditingClient, setIsEditingClient] = useState<boolean>(false);
  const [isDeletingClient, setIsDeletingClient] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = (client: Client) => {
    setClients([...clients, client]);
  };

  const handleEditClient = (updatedClient: Client) => {
    setClients(
      clients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter((client) => client.id !== clientId));
    setIsDeletingClient(false);
  };

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
          className="pl-10 pr-4 h-10 w-full rounded-md flex rounded-md p-2 border border-gray-300 bg-white text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
        />
      </div>

      {/* Client Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
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
                    {client.projects} active projects
                  </CardDescription>
                </div>
                <Badge
                  className={`px-2 text-sm rounded-full ${
                    client.status === "active"
                      ? "bg-black/90 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
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
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiPhone className="h-4 w-4" />
                {client.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiMapPin className="h-4 w-4" />
                {client.address}
              </div>
              {client.notes && (
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {client.notes}
                </p>
              )}
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-gray-500">
                  Last order: {client.lastOrder}
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
        ))}
      </div>

      {/* Modals */}
      <AddClientModal
        isOpen={isAddingClient}
        onClose={() => setIsAddingClient(false)}
        onAddClient={handleAddClient}
      />
      {selectedClient && (
        <>
          <EditClientModal
            isOpen={isEditingClient}
            onClose={() => setIsEditingClient(false)}
            client={selectedClient}
            onEditClient={handleEditClient}
          />
          <DeleteClientModal
            isOpen={isDeletingClient}
            onClose={() => setIsDeletingClient(false)}
            clientName={selectedClient.name}
            onDeleteClient={() => handleDeleteClient(selectedClient.id)}
          />
        </>
      )}
    </div>
  );
};

export default ClientsPage;
