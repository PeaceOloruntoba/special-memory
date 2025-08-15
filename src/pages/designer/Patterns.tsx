"use client";

import type React from "react";
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

export default function PatternDesignerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<
    "brush" | "eraser" | "line" | "rectangle" | "circle"
  >("brush");
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState("#000000");
  const [patternName, setPatternName] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

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
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const savePattern = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${patternName || "pattern"}.png`;
    link.href = canvas.toDataURL();
    link.click();
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
                  value={patternName}
                  onChange={(e: any) => setPatternName(e.target.value)}
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
                  onChange={(e: any) =>
                    setBrushSize(parseInt(e.target.value) || 1)
                  }
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
                    onChange={(e: any) => setColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={color}
                    onChange={(e: any) => setColor(e.target.value)}
                    placeholder="#000000"
                    className="p- rounded-md text-black/80"
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
                  style={{ width: "100%", height: "100%" }}
                />
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <Button className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 h-8 w-8 p-0">
                    <FaUndo className="h-4 w-4" />
                  </Button>
                  <Button className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 h-8 w-8 p-0">
                    <FaRedo className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-500">Canvas: 800 x 600px</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pattern Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Pattern Templates</CardTitle>
          <CardDescription>Start with a pre-made template</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "Basic Dress",
              "A-Line Skirt",
              "Button-Up Shirt",
              "Blazer",
              "Pants",
              "Sleeve",
            ].map((template) => (
              <div key={template} className="text-center">
                <div className="w-full h-24 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                  <FaPalette className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium">{template}</p>
                <Button className="mt-1 bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 h-8 text-sm">
                  Load
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
