import Button from "../ui/Button";
import { useProjectStore } from "../../store/useProjectStore";

interface Project {
  id: string;
  name: string;
}

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const { deleteProject, isLoading } = useProjectStore();

  const handleDelete = async () => {
    try {
      await deleteProject(project.id);
      onClose();
    } catch (error) {
      // Error handling via store toast
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Delete Project
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Are you sure you want to delete the project{" "}
          <strong>{project.name}</strong>? This action cannot be undone.
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

export default DeleteProjectModal;
