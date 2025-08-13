import Button from "../../components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

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
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

interface DetailsInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
}

const DetailsInvoiceModal: React.FC<DetailsInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Invoice Details
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Details for invoice {invoice.invoiceNumber}
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">
              Invoice Information
            </h3>
            <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Invoice Number:</span>{" "}
                {invoice.invoiceNumber}
              </div>
              <div>
                <span className="font-medium">Status:</span> {invoice.status}
              </div>
              <div>
                <span className="font-medium">Due Date:</span>{" "}
                {new Date(invoice.dueDate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Total Amount:</span> $
                {invoice.amount.toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Created At:</span>{" "}
                {new Date(invoice.createdAt).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Updated At:</span>{" "}
                {new Date(invoice.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">
              Client Information
            </h3>
            <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Name:</span>{" "}
                {invoice.clientId?.name || "Unknown Client"}
              </div>
              <div>
                <span className="font-medium">Email:</span>{" "}
                {invoice.clientId?.email || "No Email"}
              </div>
              <div>
                <span className="font-medium">Address:</span>{" "}
                {invoice.clientId?.address || "No Address"}
              </div>
              <div>
                <span className="font-medium">Phone:</span>{" "}
                {invoice.clientId?.phone || "No Phone"}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">
              Project Information
            </h3>
            <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Name:</span>{" "}
                {invoice.projectId?.name || "No Project"}
              </div>
              <div>
                <span className="font-medium">Type:</span>{" "}
                {invoice.projectId?.type || "N/A"}
              </div>
              <div>
                <span className="font-medium">Description:</span>{" "}
                {invoice.projectId?.description || "N/A"}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.rate.toLocaleString()}</TableCell>
                    <TableCell>${item.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end">
            <Button
              className="border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-md cursor-pointer"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsInvoiceModal;
