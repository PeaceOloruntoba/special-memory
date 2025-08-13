import { useState, useEffect } from "react";
import {
  FiSearch,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiFileText,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiDownload,
} from "react-icons/fi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
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
import Spinner from "../../components/ui/Spinner";
import AddInvoiceModal from "../../components/invoice/AddInvoiceModal";
import EditInvoiceModal from "../../components/invoice/EditInvoiceModal";
import DeleteInvoiceModal from "../../components/invoice/DeleteInvoiceModal";
import DetailsInvoiceModal from "../../components/invoice/DetailsInvoiceModal";
import { jsPDF } from "jspdf";

interface Client {
  _id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  __v: number;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  budget: number;
  progress: number;
  dueDate: string;
  clientId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Invoice {
  id: string;
  userId: string;
  clientId: Client;
  projectId?: Project;
  invoiceNumber: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  dueDate: string;
  items: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

const Invoices: React.FC = () => {
  const { invoices, isLoading, error, getAllInvoices } = useInvoiceStore();
  const { clients, getAllClients } = useClientStore();
  const { projects, getAllProjects } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"grid" | "list">("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    getAllClients();
    getAllProjects();
    getAllInvoices();
  }, [getAllClients, getAllProjects, getAllInvoices]);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.clientId?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
        false);
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "px-2 rounded-full bg-gray-100 text-gray-800";
      case "sent":
        return "px-2 rounded-full bg-blue-100 text-blue-800";
      case "paid":
        return "px-2 rounded-full bg-green-100 text-green-800";
      case "overdue":
        return "px-2 rounded-full bg-red-100 text-red-800";
      default:
        return "px-2 rounded-full bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <FiCheckCircle className="h-4 w-4 text-green-600" />;
      case "overdue":
        return <FiAlertCircle className="h-4 w-4 text-red-600" />;
      case "sent":
        return <FiClock className="h-4 w-4 text-blue-600" />;
      default:
        return <FiFileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const downloadInvoice = (invoice: Invoice) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    // Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice", pageWidth / 2, y, { align: "center" });
    y += 10;

    // Invoice Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`, margin, y);
    y += 7;
    doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, y);
    y += 7;
    doc.text(
      `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`,
      margin,
      y
    );
    y += 10;

    // Business and Client Info
    doc.setFont("helvetica", "bold");
    doc.text("From:", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.text("Your Business Name", margin, y);
    doc.text("Your Business Address", margin, y + 5);
    doc.text("business@example.com", margin, y + 10);
    y += 20;

    doc.setFont("helvetica", "bold");
    doc.text("To:", pageWidth / 2, y - 20);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.clientId.name || "Unknown Client", pageWidth / 2, y - 15);
    doc.text(invoice.clientId.address || "No Address", pageWidth / 2, y - 10);
    doc.text(invoice.clientId.email || "No Email", pageWidth / 2, y - 5);
    y += 10;

    // Items Table
    doc.setFont("helvetica", "bold");
    doc.text("Description", margin, y);
    doc.text("Quantity", margin + 80, y, { align: "right" });
    doc.text("Rate", margin + 100, y, { align: "right" });
    doc.text("Amount", margin + 120, y, { align: "right" });
    y += 5;
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    invoice.items.forEach((item) => {
      doc.text(item.description, margin, y);
      doc.text(item.quantity.toString(), margin + 80, y, { align: "right" });
      doc.text(`$${item.rate.toLocaleString()}`, margin + 100, y, {
        align: "right",
      });
      doc.text(`$${item.amount.toLocaleString()}`, margin + 120, y, {
        align: "right",
      });
      y += 7;
    });

    // Total
    y += 5;
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Total", margin + 100, y, { align: "right" });
    doc.text(`$${invoice.amount.toLocaleString()}`, margin + 120, y, {
      align: "right",
    });
    y += 10;

    // Terms
    doc.setFont("helvetica", "bold");
    doc.text("Terms and Conditions", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    if (invoice.status === "paid") {
      doc.text("No refunds. Payment has been received.", margin, y);
    } else if (invoice.status === "sent") {
      doc.text(
        `Payment due by ${new Date(invoice.dueDate).toLocaleDateString()}.`,
        margin,
        y
      );
      doc.text(
        "Please make payments to Your Business Name via bank transfer or check.",
        margin,
        y + 5
      );
      y += 5;
    } else if (invoice.status === "draft") {
      doc.text(
        "This is a draft invoice and is subject to change until sent.",
        margin,
        y
      );
    } else if (invoice.status === "overdue") {
      doc.text(
        "Payment is overdue. Please settle the outstanding amount immediately.",
        margin,
        y
      );
    }

    // Save PDF
    doc.save(`${invoice.invoiceNumber}.pdf`);
  };

  if (isLoading && !invoices.length && !clients.length && !projects.length) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Spinner />
          <p className="text-xl text-gray-700">Loading invoices...</p>
        </div>
      </div>
    );
  }

  if (error && !invoices.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 min-h-screen">
        <p className="text-xl text-red-500 mb-4">Error: {error}</p>
        <Button
          className="bg-black/90 text-white hover:bg-black/80 px-4 py-2 rounded-md cursor-pointer"
          onClick={() => {
            getAllClients();
            getAllProjects();
            getAllInvoices();
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Invoice Management
          </h1>
          <p className="text-gray-600">Track and manage all your invoices</p>
        </div>
        <Button
          className="bg-black/90 flex items-center justify-center text-nowrap text-white hover:bg-black/80 px-4 py-2 rounded-md cursor-pointer"
          onClick={() => {
            setIsAddModalOpen(true);
            setIsEditModalOpen(false);
            setIsDeleteModalOpen(false);
            setIsDetailsModalOpen(false);
          }}
        >
          <FiPlus className="h-4 w-4 mr-2" />
          Add Invoice
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2">
        <Button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "grid"
              ? "bg-black/90 text-white hover:bg-black/80"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("grid")}
        >
          Grid View
        </Button>
        <Button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "list"
              ? "bg-black/90 text-white hover:bg-black/80"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("list")}
        >
          List View
        </Button>
      </div>

      {/* Grid View */}
      {activeTab === "grid" && (
        <>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 w-full rounded-md border border-gray-300 bg-white text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              className="w-48"
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvoices.map((invoice) => (
              <Card
                key={invoice.id}
                className="hover:shadow-lg transition-shadow bg-white"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(invoice.status)}
                      <CardTitle className="text-lg">
                        {invoice.invoiceNumber}
                      </CardTitle>
                    </div>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {invoice.projectId?.name || "No Project"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <FiUser className="h-4 w-4 text-gray-500" />
                      {invoice.clientId?.name || "Unknown Client"}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="h-4 w-4" />
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="h-4 w-4" />$
                      {invoice.amount.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1 bg-black/90 text-white hover:bg-black/80 py-2 rounded-md cursor-pointer"
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setIsDetailsModalOpen(true);
                        setIsEditModalOpen(false);
                        setIsDeleteModalOpen(false);
                        setIsAddModalOpen(false);
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50 p-2 rounded-md cursor-pointer"
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setIsEditModalOpen(true);
                        setIsDetailsModalOpen(false);
                        setIsDeleteModalOpen(false);
                        setIsAddModalOpen(false);
                      }}
                    >
                      <FiEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50 p-2 rounded-md cursor-pointer"
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setIsDeleteModalOpen(true);
                        setIsDetailsModalOpen(false);
                        setIsEditModalOpen(false);
                        setIsAddModalOpen(false);
                      }}
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50 p-2 rounded-md cursor-pointer"
                      onClick={() => downloadInvoice(invoice)}
                    >
                      <FiDownload className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredInvoices.length === 0 && (
              <p className="text-sm text-gray-600 col-span-full">
                No invoices found.
              </p>
            )}
          </div>
        </>
      )}

      {/* List View */}
      {activeTab === "list" && (
        <>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 w-full rounded-md border border-gray-300 bg-white text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              className="w-48"
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-8 md:items-center md:justify-between pt-4">
                    <div className="flex items-center gap-4 flex-1">
                      {getStatusIcon(invoice.status)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {invoice.invoiceNumber}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {invoice.projectId?.name || "No Project"}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FiUser className="h-4 w-4" />
                            {invoice.clientId?.name || "Unknown Client"}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiCalendar className="h-4 w-4" />
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiDollarSign className="h-4 w-4" />$
                            {invoice.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="bg-black/90 text-white hover:bg-black/80 py-2 px-6 rounded-md cursor-pointer"
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setIsDetailsModalOpen(true);
                            setIsEditModalOpen(false);
                            setIsDeleteModalOpen(false);
                            setIsAddModalOpen(false);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 p-2 rounded-md cursor-pointer border"
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setIsEditModalOpen(true);
                            setIsDetailsModalOpen(false);
                            setIsDeleteModalOpen(false);
                            setIsAddModalOpen(false);
                          }}
                        >
                          <FiEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 p-2 rounded-md cursor-pointer border"
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setIsDeleteModalOpen(true);
                            setIsDetailsModalOpen(false);
                            setIsEditModalOpen(false);
                            setIsAddModalOpen(false);
                          }}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 p-2 rounded-md cursor-pointer border"
                          onClick={() => downloadInvoice(invoice)}
                        >
                          <FiDownload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredInvoices.length === 0 && (
              <p className="text-sm text-gray-600">No invoices found.</p>
            )}
          </div>
        </>
      )}

      {/* Invoice Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invoices
            </CardTitle>
            <FiFileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-gray-500">All invoices</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <FiCheckCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invoices.filter((i) => i.status === "paid").length}
            </div>
            <p className="text-xs text-gray-500">Paid this month</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <FiAlertCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invoices.filter((i) => i.status === "overdue").length}
            </div>
            <p className="text-xs text-gray-500">Past due</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <FiDollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${invoices.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">From all invoices</p>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <AddInvoiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      {selectedInvoice && (
        <>
          <EditInvoiceModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedInvoice(null);
            }}
            invoice={selectedInvoice}
          />
          <DeleteInvoiceModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedInvoice(null);
            }}
            invoice={selectedInvoice}
          />
          <DetailsInvoiceModal
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedInvoice(null);
            }}
            invoice={selectedInvoice}
          />
        </>
      )}
    </div>
  );
};

export default Invoices;
