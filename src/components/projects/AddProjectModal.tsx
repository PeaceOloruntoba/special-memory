import { useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import { useProjectStore } from "../../store/useProjectStore";
import { useClientStore } from "../../store/useClientStore";
import { useNavigate } from "react-router";

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

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { clients, isLoading } = useClientStore();
  const { addProject } = useProjectStore();
  const [newProject, setNewProject] = useState({
    clientId: "",
    name: "",
    description: "",
    type: "",
    status: "planning" as "planning" | "in-progress" | "review" | "completed",
    priority: "low" as "low" | "medium" | "high",
    progress: 0,
    dueDate: "",
    budget: "",
  });

  const resetForm = () => {
    setNewProject({
      clientId: "",
      name: "",
      description: "",
      type: "",
      status: "planning",
      priority: "low",
      progress: 0,
      dueDate: "",
      budget: "",
    });
  };
  const navigate = useNavigate();
  

  const handleAddProject = async () => {
    try {
      await addProject({
        clientId: newProject.clientId,
        name: newProject.name,
        description: newProject.description || undefined,
        type: newProject.type,
        status: newProject.status,
        priority: newProject.priority,
        progress: newProject.progress,
        dueDate: newProject.dueDate || undefined,
        budget: newProject.budget ? Number(newProject.budget) : undefined,
      }, navigate);
      resetForm();
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
          Add New Project
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Enter the details for the new project.
        </p>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientId">Client</Label>
            <Select
              value={newProject.clientId}
              onValueChange={(value) =>
                setNewProject({ ...newProject, clientId: value })
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
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              placeholder="e.g., Wedding Dress - Maria Garcia"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Project Type</Label>
            <Select
              value={newProject.type}
              onValueChange={(value) =>
                setNewProject({ ...newProject, type: value })
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
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              placeholder="e.g., Custom wedding dress with cathedral train"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={newProject.status}
              onValueChange={(value) =>
                setNewProject({
                  ...newProject,
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
              value={newProject.priority}
              onValueChange={(value) =>
                setNewProject({
                  ...newProject,
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
              value={newProject.progress}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  progress: Number(e.target.value),
                })
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
              value={newProject.dueDate}
              onChange={(e) =>
                setNewProject({ ...newProject, dueDate: e.target.value })
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
              value={newProject.budget}
              onChange={(e) =>
                setNewProject({ ...newProject, budget: e.target.value })
              }
              placeholder="0"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              className="border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-md cursor-pointer"
              onClick={() => {
                resetForm();
                onClose();
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-black/90 text-white hover:bg-black/80 px-4 py-2 rounded-md cursor-pointer"
              onClick={handleAddProject}
              disabled={
                isLoading ||
                !newProject.clientId ||
                !newProject.name ||
                !newProject.type
              }
            >
              Save Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
