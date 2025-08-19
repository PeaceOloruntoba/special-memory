import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import Textarea from "../../components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import Badge from "../../components/ui/Badge";
import {
  FaDownload,
  FaMagic,
  FaImage,
  FaPalette,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { FaHandSparkles } from "react-icons/fa6";
import { usePatternStore } from "../../store/usePatternStore";
import Modal from "../../components/ui/Modal";
import { toast } from "sonner";

interface FormData {
  garmentType: string;
  style: string;
  sizeRange: string;
  fabricType: string;
  occasion: string;
  description: string;
  name: string;
}

export default function AIPatternPage() {
  const {
    publicPatterns,
    userPatterns,
    loading,
    error,
    fetchPublicPatterns,
    fetchUserPatterns,
    createPattern,
    updatePattern,
    deletePattern,
    movePatternToPublic,
  } = usePatternStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    garmentType: "",
    style: "",
    sizeRange: "",
    fabricType: "",
    occasion: "",
    description: "",
    name: "",
  });
  const [editPattern, setEditPattern] = useState<FormData | null>(null);
  const [editPatternId, setEditPatternId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPublicModalOpen, setIsPublicModalOpen] = useState(false);
  const [publicPatternId, setPublicPatternId] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicPatterns();
    fetchUserPatterns();
  }, [fetchPublicPatterns, fetchUserPatterns]);

  const handleCreate = async () => {
    setIsGenerating(true);
    try {
      await createPattern({
        name: formData.name || `${formData.style} ${formData.garmentType}`,
        description: formData.description,
        garmentType: formData.garmentType,
        style: formData.style,
        sizeRange: formData.sizeRange,
        fabricType: formData.fabricType,
        occasion: formData.occasion,
        additionalDetails: formData.description,
      });
      setFormData({
        garmentType: "",
        style: "",
        sizeRange: "",
        fabricType: "",
        occasion: "",
        description: "",
        name: "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = (pattern: FormData & { _id: string }) => {
    setEditPattern({
      name: pattern.name,
      description: pattern.description || "",
      garmentType: pattern.garmentType,
      style: pattern.style,
      sizeRange: pattern.sizeRange,
      fabricType: pattern.fabricType,
      occasion: pattern.occasion || "",
    });
    setEditPatternId(pattern._id);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editPattern || !editPatternId) return;
    try {
      await updatePattern(editPatternId, editPattern);
      setIsEditModalOpen(false);
      setEditPattern(null);
      setEditPatternId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveToPublic = (patternId: string) => {
    setPublicPatternId(patternId);
    setIsPublicModalOpen(true);
  };

  const confirmMoveToPublic = async () => {
    if (!publicPatternId) return;
    try {
      await movePatternToPublic(publicPatternId);
      setIsPublicModalOpen(false);
      setPublicPatternId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (patternId: string) => {
    if (!patternId) return;
    try {
      await deletePattern(patternId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6 relative">
      <div className="bg-black/70 w-full min-h-screen z-50 inset-0 absolute">
        <div className="flex items-center justify-center text-center w-full h-screen">
          <span className="text-white/80 text-4xl font-semibold animate-bounce">Coming soon!!!</span>
        </div>
      </div>
      {/* Error Display */}
      {error && toast.error(error)}

      {/* Pattern Library (Public Patterns) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaImage className="h-5 w-5" />
            Public Pattern Library
          </CardTitle>
          <CardDescription>
            Browse and use patterns from the public collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-center">Loading...</p>}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {publicPatterns.map((pattern) => (
              <div
                key={pattern._id}
                className="text-center group cursor-pointer relative"
              >
                <div className="w-full h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-2 flex items-center justify-center group-hover:shadow-md transition-shadow">
                  {pattern.image_urls[0] ? (
                    <img
                      src={pattern.image_urls[0]}
                      alt={pattern.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <FaPalette className="h-6 w-6 text-purple-600" />
                  )}
                </div>
                <p className="text-sm font-medium truncate">{pattern.name}</p>
                <p className="text-xs text-gray-500">{pattern.garmentType}</p>
                <Badge className="border border-gray-300 py-2 px-6 rounded-md text-xs mt-1">
                  {pattern.isAiGenerated ? "AI" : "User"} Generated
                </Badge>
              </div>
            ))}
            {publicPatterns.length === 0 && !loading && (
              <p className="text-center col-span-full">
                No public patterns available.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            AI Pattern Generator
          </h1>
          <p className="text-gray-600">
            Generate custom patterns using artificial intelligence
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generation Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaMagic className="h-5 w-5" />
                Pattern Specifications
              </CardTitle>
              <CardDescription>
                Describe your desired pattern and let AI create it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Pattern Name</Label>
                <Input
                  id="name"
                  placeholder="Enter pattern name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="garmentType">Garment Type</Label>
                <Select
                  value={formData.garmentType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, garmentType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select garment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Dress",
                      "Blouse",
                      "Skirt",
                      "Pants",
                      "Jacket",
                      "Other",
                    ].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Select
                  value={formData.style}
                  onValueChange={(value) =>
                    setFormData({ ...formData, style: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Casual",
                      "Formal",
                      "Vintage",
                      "Modern",
                      "Sportswear",
                      "Boho",
                      "Other",
                    ].map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sizeRange">Size Range</Label>
                <Select
                  value={formData.sizeRange}
                  onValueChange={(value) =>
                    setFormData({ ...formData, sizeRange: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size range" />
                  </SelectTrigger>
                  <SelectContent>
                    {["XS-S", "M-L", "XL-XXL", "All sizes", "Custom"].map(
                      (size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fabricType">Fabric Type</Label>
                <Select
                  value={formData.fabricType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, fabricType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fabric" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Cotton",
                      "Silk",
                      "Wool",
                      "Linen",
                      "Denim",
                      "Satin",
                      "Leather",
                      "Knit",
                      "Other",
                    ].map((fabric) => (
                      <SelectItem key={fabric} value={fabric}>
                        {fabric}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="occasion">Occasion</Label>
                <Input
                  className="w-full border border-gray-300 p-2 rounded-md"
                  id="occasion"
                  placeholder="e.g., wedding, office, casual wear"
                  value={formData.occasion}
                  onChange={(e) =>
                    setFormData({ ...formData, occasion: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Additional Details</Label>
                <Textarea
                  id="description"
                  placeholder="Describe any specific features, colors, or design elements..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <Button
                onClick={handleCreate}
                disabled={
                  isGenerating ||
                  !formData.garmentType ||
                  !formData.style ||
                  !formData.sizeRange ||
                  !formData.fabricType
                }
                className="w-full flex items-center justify-center py-2 px-6 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <FaHandSparkles className="h-4 w-4 mr-2 animate-spin" />
                    Generating Pattern...
                  </>
                ) : (
                  <>
                    <FaHandSparkles className="h-4 w-4 mr-2" />
                    Generate Pattern
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Generated Patterns (User's Patterns) */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {isGenerating && (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <FaHandSparkles className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Generating Your Pattern
                    </h3>
                    <p className="text-gray-600">
                      AI is creating a custom pattern based on your
                      specifications...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {userPatterns.map((pattern) => (
              <Card key={pattern._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{pattern.name}</CardTitle>
                      <CardDescription>
                        {pattern.description || "No description provided"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="py-1 px-3 bg-gray-200 text-gray-800 rounded-full">
                        {pattern.style}
                      </Badge>
                      <Badge className="py-1 px-3 bg-gray-200 text-gray-800 rounded-full">
                        {pattern.difficulty || "Not specified"}
                      </Badge>
                      {pattern.isWatermarked && (
                        <Badge className="py-1 px-3 bg-orange-100 text-orange-600 rounded-full">
                          Watermarked
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <img
                        src={
                          pattern.image_urls[0] ||
                          "/placeholder.svg?height=300&width=400"
                        }
                        alt={pattern.name}
                        className="w-full h-48 object-cover rounded-lg bg-gray-100"
                      />
                      {pattern.isWatermarked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
                          <div className="bg-white bg-opacity-90 px-3 py-1 rounded text-sm font-medium">
                            FashionStudio
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">
                          Materials Needed:
                        </h4>
                        <ul className="text-sm space-y-1">
                          {pattern.materials.map((material, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              {material}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Instructions:</h4>
                    <ol className="text-sm space-y-1">
                      {pattern.instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="font-medium text-purple-600">
                            {index + 1}.
                          </span>
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-4">
                    <Button
                      onClick={() =>
                        handleEdit({
                          _id: pattern._id,
                          name: pattern.name,
                          description: pattern.description || "",
                          garmentType: pattern.garmentType,
                          style: pattern.style,
                          sizeRange: pattern.sizeRange,
                          fabricType: pattern.fabricType,
                          occasion: pattern.occasion || "",
                        })
                      }
                      className="py-2 px-6 flex items-center justify-center text-nowrap bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      <FaEdit className="h-4 w-4 mr-2" />
                      Edit Pattern
                    </Button>
                    <Button
                      onClick={() => handleMoveToPublic(pattern._id)}
                      className="py-2 px-6 flex items-center justify-center text-nowrap bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      <FaImage className="h-4 w-4 mr-2" />
                      Make Public
                    </Button>
                    <Button
                      onClick={() => handleDelete(pattern._id)}
                      className="py-2 px-6 flex items-center justify-center text-nowrap bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      <FaTrash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    <Button className="py-2 px-6 flex items-center justify-center text-nowrap border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100">
                      <FaDownload className="h-4 w-4 mr-2" />
                      Download PDF
                      {pattern.isWatermarked && (
                        <span className="ml-1 text-xs">(Watermarked)</span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {userPatterns.length === 0 && !loading && !isGenerating && (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <FaImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Patterns Generated Yet
                    </h3>
                    <p className="text-gray-600">
                      Fill out the form on the left to generate your first AI
                      pattern!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Pattern"
        description="Update the pattern details below."
      >
        {editPattern && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Pattern Name</Label>
              <Input
                id="edit-name"
                value={editPattern.name}
                onChange={(e) =>
                  setEditPattern({ ...editPattern, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editPattern.description}
                onChange={(e) =>
                  setEditPattern({
                    ...editPattern,
                    description: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-garmentType">Garment Type</Label>
              <Select
                value={editPattern.garmentType}
                onValueChange={(value) =>
                  setEditPattern({ ...editPattern, garmentType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select garment type" />
                </SelectTrigger>
                <SelectContent>
                  {["Dress", "Blouse", "Skirt", "Pants", "Jacket", "Other"].map(
                    (type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-style">Style</Label>
              <Select
                value={editPattern.style}
                onValueChange={(value) =>
                  setEditPattern({ ...editPattern, style: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Casual",
                    "Formal",
                    "Vintage",
                    "Modern",
                    "Sportswear",
                    "Boho",
                    "Other",
                  ].map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sizeRange">Size Range</Label>
              <Select
                value={editPattern.sizeRange}
                onValueChange={(value) =>
                  setEditPattern({ ...editPattern, sizeRange: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size range" />
                </SelectTrigger>
                <SelectContent>
                  {["XS-S", "M-L", "XL-XXL", "All sizes", "Custom"].map(
                    (size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-fabricType">Fabric Type</Label>
              <Select
                value={editPattern.fabricType}
                onValueChange={(value) =>
                  setEditPattern({ ...editPattern, fabricType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fabric" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Cotton",
                    "Silk",
                    "Wool",
                    "Linen",
                    "Denim",
                    "Satin",
                    "Leather",
                    "Knit",
                    "Other",
                  ].map((fabric) => (
                    <SelectItem key={fabric} value={fabric}>
                      {fabric}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-occasion">Occasion</Label>
              <Input
                id="edit-occasion"
                value={editPattern.occasion}
                onChange={(e) =>
                  setEditPattern({ ...editPattern, occasion: e.target.value })
                }
              />
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={() => setIsEditModalOpen(false)}
            className="py-2 px-6 flex items-center justify-center text-nowrap border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            className="py-2 px-6 flex items-center justify-center text-nowrap bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Save Changes
          </Button>
        </div>
      </Modal>

      {/* Move to Public Confirmation Modal */}
      <Modal
        isOpen={isPublicModalOpen}
        onClose={() => setIsPublicModalOpen(false)}
        title="Confirm Move to Public"
        description="Are you sure you want to move this pattern to the public library? It will be accessible to all users."
      >
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={() => setIsPublicModalOpen(false)}
            className="py-2 px-6 flex items-center justify-center text-nowrap border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmMoveToPublic}
            className="py-2 px-6 flex items-center justify-center text-nowrap bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Make Public
          </Button>
        </div>
      </Modal>
    </div>
  );
}
