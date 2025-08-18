import { useState, useRef, useEffect } from "react";
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
import {
  FaPalette,
  FaBrush,
  FaEraser,
  FaSquare,
  FaMinus,
  FaSave,
  FaUndo,
  FaRedo,
  FaTrashAlt,
} from "react-icons/fa";
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

export default function PatternDesignerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<
    "brush" | "eraser" | "line" | "rectangle" | "circle"
  >("brush");
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState("#000000");
  const [formData, setFormData] = useState<FormData>({
    garmentType: "Other",
    style: "Other",
    sizeRange: "Custom",
    fabricType: "Other",
    occasion: "",
    description: "",
    name: "",
  });
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPattern, setEditPattern] = useState<FormData | null>(null);
  const [editPatternId, setEditPatternId] = useState<string | null>(null);
  const {
    userPatterns,
    loading,
    error,
    createPattern,
    updatePattern,
    fetchUserPatterns,
  } = usePatternStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    fetchUserPatterns();
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial canvas state
    setUndoStack([canvas.toDataURL()]);
  }, []);

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setUndoStack((prev) => [...prev, canvas.toDataURL()]);
    setRedoStack([]); // Clear redo stack on new action
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";

    if (tool === "brush") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
    } else if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "white";
    } else {
      return; // Add line/rectangle/circle logic if needed
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      saveCanvasState();
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveCanvasState();
  };

  const undo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (undoStack.length <= 1) return;

    const currentState = canvas.toDataURL();
    setRedoStack((prev) => [currentState, ...prev]);
    const prevState = undoStack[undoStack.length - 2];
    setUndoStack((prev) => prev.slice(0, -1));

    const img = new Image();
    img.src = prevState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const redo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (redoStack.length === 0) return;

    const nextState = redoStack[0];
    setRedoStack((prev) => prev.slice(1));
    setUndoStack((prev) => [...prev, canvas.toDataURL()]);

    const img = new Image();
    img.src = nextState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const savePattern = () => {
    setFormData((prev) => ({
      ...prev,
      name: formData.name || "Custom Pattern",
    }));
    setIsCreateModalOpen(true);
  };

  const handleCreate = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const base64Image = canvas.toDataURL("image/png").split(",")[1]; // Base64 without prefix

    try {
      await createPattern(
        {
          name: formData.name || "Custom Pattern",
          description: formData.description,
          garmentType: formData.garmentType,
          style: formData.style,
          sizeRange: formData.sizeRange,
          fabricType: formData.fabricType,
          occasion: formData.occasion,
          additionalDetails: formData.description,
        },
        base64Image,
        false
      );
      setIsCreateModalOpen(false);
      setFormData({
        garmentType: "Other",
        style: "Other",
        sizeRange: "Custom",
        fabricType: "Other",
        occasion: "",
        description: "",
        name: "",
      });
      clearCanvas();
    } catch (err) {
      console.error(err);
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pattern Designer</h1>
          <p className="text-gray-600">
            Create and edit patterns with digital tools
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Tools Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaPalette className="h-5 w-5" />
                Design Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pattern Name */}
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="patternName">Pattern Name</Label>
                <Input
                  id="patternName"
                  className="p-2 border border-gray-300 rounded-md text-black/80"
                  placeholder="Enter pattern name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/* Drawing Tools */}
              <div className="space-y-3">
                <Label>Drawing Tools</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className={`h-8 flex items-center justify-center ${
                      tool === "brush"
                        ? "bg-black text-white"
                        : "bg-white text-gray-900 border border-gray-300"
                    }`}
                    onClick={() => setTool("brush")}
                  >
                    <FaBrush className="h-4 w-4" />
                  </Button>
                  <Button
                    className={`h-8 flex items-center justify-center ${
                      tool === "eraser"
                        ? "bg-black text-white"
                        : "bg-white text-gray-900 border border-gray-300"
                    }`}
                    onClick={() => setTool("eraser")}
                  >
                    <FaEraser className="h-4 w-4" />
                  </Button>
                  <Button
                    className={`h-8 flex items-center justify-center ${
                      tool === "line"
                        ? "bg-black text-white"
                        : "bg-white text-gray-900 border border-gray-300"
                    }`}
                    onClick={() => setTool("line")}
                  >
                    <FaMinus className="h-4 w-4" />
                  </Button>
                  <Button
                    className={`h-8 flex items-center justify-center ${
                      tool === "rectangle"
                        ? "bg-black text-white"
                        : "bg-white text-gray-900 border border-gray-300"
                    }`}
                    onClick={() => setTool("rectangle")}
                  >
                    <FaSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Brush Size */}
              <div className="space-y-3 flex flex-col">
                <Label htmlFor="brushSize">Brush Size: {brushSize}px</Label>
                <Input
                  id="brushSize"
                  type="number"
                  className="p-2 border border-gray-300 rounded-md text-black/80"
                  min={1}
                  max={50}
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value) || 1)}
                />
              </div>

              {/* Color Picker */}
              <div className="space-y-2 w-fit flex flex-col">
                <Label htmlFor="color">Color</Label>
                <div className="flex w-fit gap-2 border border-gray-300 rounded-md p-2">
                  <input
                    type="color"
                    id="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="#000000"
                    className="p-2 rounded-md text-black/80"
                  />
                </div>
              </div>

              {/* Quick Colors */}
              <div className="space-y-2">
                <Label>Quick Colors</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    "#000000",
                    "#FF0000",
                    "#00FF00",
                    "#0000FF",
                    "#FFFF00",
                    "#FF00FF",
                    "#00FFFF",
                    "#FFA500",
                  ].map((quickColor) => (
                    <button
                      key={quickColor}
                      className="w-8 h-8 rounded border-2 border-gray-300"
                      style={{ backgroundColor: quickColor }}
                      onClick={() => setColor(quickColor)}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  onClick={clearCanvas}
                  className="w-full flex items-center justify-center py-2 rounded-md bg-transparent text-gray-900 border border-gray-300 hover:bg-gray-100"
                >
                  <FaTrashAlt className="h-4 w-4 mr-2" />
                  Clear Canvas
                </Button>
                <Button
                  onClick={savePattern}
                  className="w-full flex items-center justify-center py-2 rounded-md bg-black text-white hover:bg-gray-800"
                >
                  <FaSave className="h-4 w-4 mr-2" />
                  Save Pattern
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-2 h-full">
          <Card>
            <CardHeader>
              <CardTitle>Design Canvas</CardTitle>
              <CardDescription>
                Use the tools on the left to create your pattern design
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <canvas
                  ref={canvasRef}
                  className="border border-gray-300 bg-white rounded cursor-crosshair max-w-full"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  style={{ width: "100%", height: "600px" }}
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <Button
                    onClick={undo}
                    className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 h-8 w-8 p-0"
                    disabled={undoStack.length <= 1}
                  >
                    <FaUndo className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={redo}
                    className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 h-8 w-8 p-0"
                    disabled={redoStack.length === 0}
                  >
                    <FaRedo className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-500">Canvas: 800 x 600px</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Your Patterns</CardTitle>
          <CardDescription>
            View and manage your custom patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-center">Loading...</p>}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {userPatterns.map((pattern) => (
              <div
                key={pattern._id}
                className="text-center group cursor-pointer relative"
              >
                <div className="w-full h-24 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                  {pattern.image_urls[0] ? (
                    <img
                      src={pattern.image_urls[0]}
                      alt={pattern.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <FaPalette className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <p className="text-sm font-medium truncate">{pattern.name}</p>
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
                  className="mt-1 bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 h-8 text-sm"
                >
                  Edit
                </Button>
              </div>
            ))}
            {userPatterns.length === 0 && !loading && (
              <p className="text-center col-span-full">
                No patterns created yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Pattern Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Save Pattern"
        description="Provide details for your pattern."
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="create-name">Pattern Name</Label>
            <Input
              id="create-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-description">Description</Label>
            <Textarea
              id="create-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-garmentType">Garment Type</Label>
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
            <Label htmlFor="create-style">Style</Label>
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
            <Label htmlFor="create-sizeRange">Size Range</Label>
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
            <Label htmlFor="create-fabricType">Fabric Type</Label>
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
            <Label htmlFor="create-occasion">Occasion</Label>
            <Input
              id="create-occasion"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              value={formData.occasion}
              onChange={(e) =>
                setFormData({ ...formData, occasion: e.target.value })
              }
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2 text-lg font-semibold">
          <Button
            onClick={() => setIsCreateModalOpen(false)}
            className="border border-gray-300 py-2 px-6 rounded-md"
          >
            Cancel
          </Button>
          <Button onClick={handleCreate} className="bg-black/90 py-2 px-6 rounded-md text-white">Save Pattern</Button>
        </div>
      </Modal>

      {/* Edit Pattern Modal */}
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
    </div>
  );
}
