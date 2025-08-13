import { FiCalendar, FiDollarSign, FiUser } from "react-icons/fi";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

interface Project {
  id: string;
  userId: string;
  clientId: string;
  name: string;
  description?: string;
  type: string;
  status: "planning" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high";
  progress: number;
  dueDate?: string;
  budget?: number;
  createdAt: string;
  updatedAt: string;
  clientName?: string;
}

interface DetailsProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

const DetailsProjectModal: React.FC<DetailsProjectModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "px-4 rounded-full bg-blue-100 text-blue-800";
      case "in-progress":
        return "px-4 rounded-full bg-yellow-100 text-yellow-800";
      case "review":
        return "px-4 rounded-full bg-purple-100 text-purple-800";
      case "completed":
        return "px-4 rounded-full bg-green-100 text-green-800";
      default:
        return "px-4 rounded-full bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "px-4 rounded-full bg-red-100 text-red-800";
      case "medium":
        return "px-4 rounded-full bg-yellow-100 text-yellow-800";
      case "low":
        return "px-4 rounded-full bg-green-100 text-green-800";
      default:
        return "px-4 rounded-full bg-gray-100 text-gray-800";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-4/5 rounded-lg bg-white p-6 shadow-lg h-4/5 overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Project Details
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Project Name</h3>
            <p className="text-gray-900">{project.name}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Client</h3>
            <p className="flex items-center gap-2 text-gray-900">
              <FiUser className="h-4 w-4" />
              {project.clientName || "Unknown Client"}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Type</h3>
            <p className="text-gray-900">{project.type}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Description</h3>
            <p className="text-gray-900">{project.description || "N/A"}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Status</h3>
            <Badge className={getStatusColor(project.status)}>
              {project.status.replace("-", " ")}
            </Badge>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Priority</h3>
            <Badge className={getPriorityColor(project.priority)}>
              {project.priority}
            </Badge>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Progress</h3>
            <div className="flex justify-between text-sm">
              <span>{project.progress}%</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div
                className="h-2 bg-purple-600 rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Due Date</h3>
            <p className="flex items-center gap-2 text-gray-900">
              <FiCalendar className="h-4 w-4" />
              {project.dueDate
                ? new Date(project.dueDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Budget</h3>
            <p className="flex items-center gap-2 text-gray-900">
              <FiDollarSign className="h-4 w-4" />$
              {project.budget?.toLocaleString() || "N/A"}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Created At</h3>
            <p className="flex items-center gap-2 text-gray-900">
              <FiCalendar className="h-4 w-4" />
              {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Updated At</h3>
            <p className="flex items-center gap-2 text-gray-900">
              <FiCalendar className="h-4 w-4" />
              {new Date(project.updatedAt).toLocaleDateString()}
            </p>
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

export default DetailsProjectModal;
