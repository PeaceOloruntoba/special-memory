import Button from "../../components/ui/Button";
import { useInvoiceStore } from "../../store/useInvoiceStore";

interface DeleteInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: { id: string; invoiceNumber: string };
}

const DeleteInvoiceModal: React.FC<DeleteInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
}) => {
  const { deleteInvoice, isLoading } = useInvoiceStore();

  const handleDelete = async () => {
    try {
      await deleteInvoice(invoice.id);
      onClose();
    } catch (error) {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Delete Invoice
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Are you sure you want to delete invoice{" "}
          <span className="font-medium">{invoice.invoiceNumber}</span>? This
          action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            className="border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-md cursor-pointer"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md cursor-pointer"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteInvoiceModal;
