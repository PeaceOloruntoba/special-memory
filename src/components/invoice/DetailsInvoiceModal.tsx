"use client";

import { useClientStore } from "../../store/useClientStore";
import { useProjectStore } from "../../store/useProjectStore";
import Button from "../../components/ui/Button";
import type { Invoice, InvoiceItem } from "../../types/types";

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
  const { clients } = useClientStore();
  const { projects } = useProjectStore();

  const client = clients.find((c) => c.id === invoice.clientId);
  const project = projects.find((p) => p.id === invoice.projectId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Invoice Details
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">
              Invoice Number
            </h3>
            <p className="text-gray-900">{invoice.invoiceNumber}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Client</h3>
            <p className="text-gray-900">{client?.name || "Unknown Client"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Project</h3>
            <p className="text-gray-900">{project?.name || "No Project"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Due Date</h3>
            <p className="text-gray-900">
              {new Date(invoice.dueDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Status</h3>
            <p className="text-gray-900">{invoice.status}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Items</h3>
            <table className="w-full text-sm text-gray-900">
              <thead>
                <tr>
                  <th className="text-left">Description</th>
                  <th className="text-right">Quantity</th>
                  <th className="text-right">Rate</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item: InvoiceItem, index: number) => (
                  <tr key={index}>
                    <td>{item.description}</td>
                    <td className="text-right">{item.quantity}</td>
                    <td className="text-right">
                      ${item.rate.toLocaleString()}
                    </td>
                    <td className="text-right">
                      ${item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Total Amount</h3>
            <p className="text-gray-900">${invoice.amount.toLocaleString()}</p>
          </div>
          <div className="flex justify-end">
            <Button
              className="bg-black/90 text-white hover:bg-black/80 px-4 py-2 rounded-md cursor-pointer"
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
