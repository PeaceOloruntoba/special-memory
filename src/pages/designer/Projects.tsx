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
  FiPlus,
  FiEdit,
  FiTrash2,
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
import { useProjectStore } from "../../store/useProjectStore";
import { useClientStore } from "../../store/useClientStore";
import Spinner from "../../components/ui/Spinner";
import AddProjectModal from "../../components/projects/AddProjectModal";
import EditProjectModal from "../../components/projects/EditProjectModal";
import DeleteProjectModal from "../../components/projects/DeleteProjectModal";
import DetailsProjectModal from "../../components/projects/DetailsProjectModal";

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

const Projects: React.FC = () => {
  const { projects, isLoading, error, getAllProjects } = useProjectStore();
  const { clients, getAllClients } = useClientStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"grid" | "list">("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
        return "px-2 rounded-full bg-blue-100 text-blue-800";
      case "in-progress":
        return "px-2 rounded-full bg-yellow-100 text-yellow-800";
      case "review":
        return "px-2 rounded-full bg-purple-100 text-purple-800";
      case "completed":
        return "px-2 rounded-full bg-green-100 text-green-800";
      default:
        return "px-2 rounded-full bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "px-2 rounded-full bg-red-100 text-red-800";
      case "medium":
        return "px-2 rounded-full bg-yellow-100 text-yellow-800";
      case "low":
        return "px-2 rounded-full bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        <Button
          className="bg-black/90 flex items-center justify-center text-nowrap text-white hover:bg-black/80 px-4 py-2 rounded-md cursor-pointer"
          onClick={() => setIsAddModalOpen(true)}
        >
          <FiPlus className="h-4 w-4 mr-2" />
          Add Project
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
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 w-full rounded-md border border-gray-300 bg-white text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter} className="w-48">
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
                    <Button
                      className="flex-1 bg-black/90 text-white hover:bg-black/80 py-2 rounded-md cursor-pointer"
                      onClick={() => {
                        setSelectedProject(project);
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
                        setSelectedProject(project);
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
                        setSelectedProject(project);
                        setIsDeleteModalOpen(true);
                        setIsDetailsModalOpen(false);
                        setIsEditModalOpen(false);
                        setIsAddModalOpen(false);
                      }}
                    >
                      <FiTrash2 className="h-4 w-4" />
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
            <Select value={statusFilter} onValueChange={setStatusFilter} className="w-48">
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
              <Card key={project.id} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-8 md:items-center md:justify-between pt-4">
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
                        <div className="w-32">
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
                        <Button
                          className="bg-black/90 text-white hover:bg-black/80 py-2 px-6 rounded-md cursor-pointer"
                          onClick={() => {
                            setSelectedProject(project);
                            setIsDetailsModalOpen(true);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 p-2 rounded-md cursor-pointer border"
                          onClick={() => {
                            setSelectedProject(project);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <FiEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 p-2 rounded-md cursor-pointer border"
                          onClick={() => {
                            setSelectedProject(project);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <FiTrash2 className="h-4 w-4" />
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

      {/* Modals */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      {selectedProject && (
        <>
          <EditProjectModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedProject(null);
            }}
            project={selectedProject}
          />
          <DeleteProjectModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedProject(null);
            }}
            project={selectedProject}
          />
          <DetailsProjectModal
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedProject(null);
            }}
            project={selectedProject}
          />
        </>
      )}
    </div>
  );
};

export default Projects;
