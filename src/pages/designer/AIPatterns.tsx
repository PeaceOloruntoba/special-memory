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
  FaLock,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { FaHandSparkles } from "react-icons/fa6";
import { PlanRestrictions } from "../../components/PlanRestrictions";
import { usePatternStore } from "../../store/usePatternStore";
import Modal from "../../components/ui/Modal";

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
  } = usePatternStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationsUsed, setGenerationsUsed] = useState(3); // Simulated; replace with backend tracking if available
  const [currentPlan] = useState<"free" | "premium" | "enterprise">("free"); // Simulated
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePatternId, setDeletePatternId] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicPatterns();
    fetchUserPatterns();
  }, [fetchPublicPatterns, fetchUserPatterns]);

  const handleCreate = async () => {
    if (currentPlan === "free" && generationsUsed >= 5) return;

    setIsGenerating(true);
    try {
      await createPattern(
        {
          name: formData.name || `${formData.style} ${formData.garmentType}`,
          description: formData.description,
          garmentType: formData.garmentType,
          style: formData.style,
          sizeRange: formData.sizeRange,
          fabricType: formData.fabricType,
          occasion: formData.occasion,
          additionalDetails: formData.description,
        },
        null,
        true
      );
      setGenerationsUsed((prev) => prev + 1);
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

  const handleDelete = (patternId: string) => {
    setDeletePatternId(patternId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletePatternId) return;
    try {
      await deletePattern(deletePatternId);
      setIsDeleteModalOpen(false);
      setDeletePatternId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const isAtLimit = currentPlan === "free" && generationsUsed >= 5;

  return (
    <div className="p-6 space-y-6">
      {/* Usage indicator */}
      {currentPlan === "free" && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-orange-800">
                  AI Generations Used: {generationsUsed}/5 this month
                </p>
                <p className="text-sm text-orange-600">
                  {5 - generationsUsed} generations remaining on Free plan
                </p>
              </div>
              {generationsUsed >= 4 && (
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Upgrade for Unlimited
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Pattern Library (Public Patterns) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaImage className="h-5 w-5" />
            Public Pattern Library
            {currentPlan === "free" && (
              <Badge className="text-orange-600 border-orange-600 border py-2 px-6 rounded-md">
                Limited on Free
              </Badge>
            )}
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
                  disabled={isAtLimit}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="garmentType">Garment Type</Label>
                <Select
                  value={formData.garmentType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, garmentType: value })
                  }
                  disabled={isAtLimit}
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
                  disabled={isAtLimit}
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
                  disabled={isAtLimit}
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
                  disabled={isAtLimit}
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
                  id="occasion"
                  placeholder="e.g., wedding, office, casual wear"
                  value={formData.occasion}
                  onChange={(e) =>
                    setFormData({ ...formData, occasion: e.target.value })
                  }
                  disabled={isAtLimit}
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
                  disabled={isAtLimit}
                />
              </div>
              <Button
                onClick={handleCreate}
                disabled={
                  isGenerating ||
                  !formData.garmentType ||
                  !formData.style ||
                  !formData.sizeRange ||
                  !formData.fabricType ||
                  isAtLimit
                }
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <FaHandSparkles className="h-4 w-4 mr-2 animate-spin" />
                    Generating Pattern...
                  </>
                ) : isAtLimit ? (
                  <>
                    <FaLock className="h-4 w-4 mr-2" />
                    Limit Reached
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

            {isAtLimit && (
              <PlanRestrictions
                feature="Unlimited AI Pattern Generation"
                currentPlan={currentPlan}
                requiredPlan="premium"
                description="You've reached your monthly limit of 5 AI pattern generations on the Free plan."
                upgradeMessage="Upgrade to Premium for unlimited AI pattern generations, plus access to professional templates and advanced design tools."
              />
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
                      <Badge>{pattern.style}</Badge>
                      <Badge className="border border-gray-300 py-2 px-6 rounded-md">
                        {pattern.difficulty || "Not specified"}
                      </Badge>
                      {currentPlan === "free" && (
                        <Badge className="border py-2 px-6 rounded-md text-orange-600 border-orange-600">
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
                      {currentPlan === "free" && (
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
                  <div className="flex gap-2 pt-4">
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
                    >
                      <FaEdit className="h-4 w-4 mr-2" />
                      Edit Pattern
                    </Button>
                    <Button
                      onClick={() => handleDelete(pattern._id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <FaTrash className="h-4 w-4 mr-2" />
                      Move to Public
                    </Button>
                    <Button className="border border-gray-300 py-2 px-6 rounded-md">
                      <FaDownload className="h-4 w-4 mr-2" />
                      Download PDF
                      {currentPlan === "free" && (
                        <span className="ml-1 text-xs">(Watermarked)</span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {userPatterns.length === 0 &&
              !loading &&
              !isGenerating &&
              !isAtLimit && (
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
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => setIsEditModalOpen(false)}
            className="border border-gray-300"
          >
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Save Changes</Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Move to Public"
        description="Are you sure you want to move this pattern to the public library? It will be accessible to all users and you will lose edit permissions."
      >
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => setIsDeleteModalOpen(false)}
            className="border border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Move to Public
          </Button>
        </div>
      </Modal>
    </div>
  );
}
