"use client";

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
} from "react-icons/fi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import { useProjectStore } from "../../store/useProjectStore";
import { useClientStore } from "../../store/useClientStore";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Label from "../../components/ui/Label";

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

const Projects: React.FC = () => {
  const { projects, isLoading, error, getAllProjects } = useProjectStore();
  const { clients, getAllClients } = useClientStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"grid" | "list" | "add">("grid");
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

  useEffect(() => {
    getAllClients();
    getAllProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false);
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "px-3 rounded-full bg-blue-100 text-blue-800";
      case "in-progress":
        return "px-3 rounded-full bg-yellow-100 text-yellow-800";
      case "review":
        return "px-3 rounded-full bg-purple-100 text-purple-800";
      case "completed":
        return "px-3 rounded-full bg-green-100 text-green-800";
      default:
        return "px-3 rounded-full bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "px-3 rounded-full bg-red-100 text-red-800";
      case "medium":
        return "px-3 rounded-full bg-yellow-100 text-yellow-800";
      case "low":
        return "px-3 rounded-full bg-green-100 text-green-800";
      default:
        return "px-3 rounded-full bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <FiCheckCircle className="h-4 w-4 text-green-600" />;
      case "review":
        return <FiAlertCircle className="h-4 w-4 text-purple-600" />;
      case "in-progress":
        return <FiClock className="h-4 w-4 text-yellow-600" />;
      default:
        return <FiFileText className="h-4 w-4 text-blue-600" />;
    }
  };

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

  const handleAddProject = async () => {
    try {
      await useProjectStore.getState().addProject({
        clientId: newProject.clientId,
        name: newProject.name,
        description: newProject.description || undefined,
        type: newProject.type,
        status: newProject.status,
        priority: newProject.priority,
        progress: newProject.progress,
        dueDate: newProject.dueDate || undefined,
        budget: newProject.budget ? Number(newProject.budget) : undefined,
      });
      resetForm();
      setActiveTab("grid");
    } catch (error) {
      // Error handling via store toast
    }
  };

  if (isLoading && !projects.length && !clients.length) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Spinner />
          <p className="text-xl text-gray-700">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error && !projects.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 min-h-screen">
        <p className="text-xl text-red-500 mb-4">Error: {error}</p>
        <Button
          className="bg-black/90 text-white hover:bg-black/80 px-4 py-2 rounded-md cursor-pointer"
          onClick={() => {
            getAllClients();
            getAllProjects();
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
            Project Management
          </h1>
          <p className="text-gray-600">
            Track and manage all your fashion design projects
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "grid"
                ? "bg-black/90 text-white hover:bg-black/80"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => {
              setActiveTab("grid");
              resetForm();
            }}
          >
            Grid View
          </Button>
          <Button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "list"
                ? "bg-black/90 text-white hover:bg-black/80"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => {
              setActiveTab("list");
              resetForm();
            }}
          >
            List View
          </Button>
        </div>
        <Button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors bg-black/90 text-white hover:bg-black/80`}
        >
          Add Project
        </Button>
      </div>

      {/* Grid View */}
      {activeTab === "grid" && (
        <>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search projects..."
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
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-shadow bg-white"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(project.status)}
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                    </div>
                    <Badge className={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <FiUser className="h-4 w-4 text-gray-500" />
                      {project.clientName || "Unknown Client"}
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-purple-600 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="h-4 w-4" />
                      Due:{" "}
                      {project.dueDate
                        ? new Date(project.dueDate).toLocaleDateString()
                        : "N/A"}
                    </div>
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="h-4 w-4" />$
                      {project.budget?.toLocaleString() || "N/A"}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-black/90 text-white hover:bg-black/80">
                      View Details
                    </Button>
                    <Button className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredProjects.length === 0 && (
              <p className="text-sm text-gray-600 col-span-full">
                No projects found.
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
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 w-full rounded-md border border-gray-300 bg-white text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="bg-white py-4">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {getStatusIcon(project.status)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {project.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FiUser className="h-4 w-4" />
                            {project.clientName || "Unknown Client"}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiCalendar className="h-4 w-4" />
                            {project.dueDate
                              ? new Date(project.dueDate).toLocaleDateString()
                              : "N/A"}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiDollarSign className="h-4 w-4" />$
                            {project.budget?.toLocaleString() || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex gap-2 mb-2">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status.replace("-", " ")}
                          </Badge>
                          <Badge className={getPriorityColor(project.priority)}>
                            {project.priority}
                          </Badge>
                        </div>
                        <div className="w-full">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-purple-600 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="bg-black/90 text-white hover:bg-black/80">
                          View
                        </Button>
                        <Button className="border-gray-300 text-gray-700 hover:bg-gray-50">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredProjects.length === 0 && (
              <p className="text-sm text-gray-600">No projects found.</p>
            )}
          </div>
        </>
      )}

      {/* Add Project Tab */}
      {activeTab === "add" && (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
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
                  setActiveTab("grid");
                  resetForm();
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
      )}

      {/* Project Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <FiFileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-gray-500">Active projects</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <FiClock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter((p) => p.status === "in-progress").length}
            </div>
            <p className="text-xs text-gray-500">Currently working on</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <FiCheckCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter((p) => p.status === "completed").length}
            </div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <FiDollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {projects
                .reduce((sum, p) => sum + (p.budget || 0), 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">From all projects</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Projects;
