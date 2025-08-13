import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import { useProjectStore } from "../../store/useProjectStore";
import { useClientStore } from "../../store/useClientStore";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";

const projectTypes = [
  "Wedding Dress",
  "Suit",
  "Evening Dress",
  "Shirt",
  "Pants",
  "Skirt",
  "Blouse",
  "Jacket",
];

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

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const { clients, isLoading } = useClientStore();
  const { updateProject } = useProjectStore();
  const [formData, setFormData] = useState({
    clientId: project.clientId,
    name: project.name,
    description: project.description || "",
    type: project.type,
    status: project.status,
    priority: project.priority,
    progress: project.progress,
    dueDate: project.dueDate || "",
    budget: project.budget ? project.budget.toString() : "",
  });

  useEffect(() => {
    setFormData({
      clientId: project.clientId,
      name: project.name,
      description: project.description || "",
      type: project.type,
      status: project.status,
      priority: project.priority,
      progress: project.progress,
      dueDate: project.dueDate || "",
      budget: project.budget ? project.budget.toString() : "",
    });
  }, [project]);

  const handleUpdateProject = async () => {
    try {
      await updateProject(project.id, {
        clientId: formData.clientId,
        name: formData.name,
        description: formData.description || undefined,
        type: formData.type,
        status: formData.status,
        priority: formData.priority,
        progress: formData.progress,
        dueDate: formData.dueDate || undefined,
        budget: formData.budget ? Number(formData.budget) : undefined,
      });
      onClose();
    } catch (error) {
      // Error handling via store toast
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-4/5 rounded-lg bg-white p-6 shadow-lg h-4/5 overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Edit Project
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Update the details for the project.
        </p>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientId">Client</Label>
            <Select
              value={formData.clientId}
              onValueChange={(value) =>
                setFormData({ ...formData, clientId: value })
              }
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
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Wedding Dress - Maria Garcia"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Project Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                {projectTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="e.g., Custom wedding dress with cathedral train"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  status: value as
                    | "planning"
                    | "in-progress"
                    | "review"
                    | "completed",
                })
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  priority: value as "low" | "medium" | "high",
                })
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="progress">Progress (%)</Label>
            <Input
              id="progress"
              type="number"
              value={formData.progress}
              onChange={(e) =>
                setFormData({ ...formData, progress: Number(e.target.value) })
              }
              placeholder="0"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Budget ($)</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) =>
                setFormData({ ...formData, budget: e.target.value })
              }
              placeholder="0"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              disabled={isLoading}
            />
          </div>
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
              onClick={handleUpdateProject}
              disabled={
                isLoading ||
                !formData.clientId ||
                !formData.name ||
                !formData.type
              }
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
