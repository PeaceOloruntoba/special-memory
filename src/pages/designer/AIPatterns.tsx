import { useState } from "react";
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
  FaSave,
  FaMagic,
  FaImage,
  FaPalette,
  FaLock,
} from "react-icons/fa";
import { FaHandSparkles } from "react-icons/fa6";
import { PlanRestrictions } from "../../components/PlanRestrictions";

interface GeneratedPattern {
  id: string;
  name: string;
  description: string;
  style: string;
  difficulty: string;
  imageUrl: string;
  instructions: string[];
  materials: string[];
}

export default function AIPatternPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPatterns, setGeneratedPatterns] = useState<
    GeneratedPattern[]
  >([]);
  const [generationsUsed, setGenerationsUsed] = useState(3); // Simulated usage
  const [currentPlan] = useState<"free" | "premium" | "enterprise">("free"); // Simulated current plan
  const [formData, setFormData] = useState({
    garmentType: "",
    style: "",
    size: "",
    fabric: "",
    occasion: "",
    description: "",
  });

  const generatePattern = async () => {
    // Check if user has reached free plan limit
    if (currentPlan === "free" && generationsUsed >= 5) {
      return; // This would show the restriction component
    }

    setIsGenerating(true);

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const newPattern: GeneratedPattern = {
      id: Date.now().toString(),
      name: `${formData.style} ${formData.garmentType}`,
      description:
        formData.description ||
        `A beautiful ${formData.style.toLowerCase()} ${formData.garmentType.toLowerCase()} perfect for ${
          formData.occasion
        }`,
      style: formData.style,
      difficulty: "Intermediate",
      imageUrl: `/placeholder.svg?height=300&width=400&text=${formData.garmentType}+Pattern`,
      instructions: [
        "Cut fabric pieces according to pattern layout",
        'Sew shoulder seams with 5/8" seam allowance',
        "Attach sleeves using set-in sleeve technique",
        "Sew side seams from armpit to hem",
        "Finish neckline with bias tape or facing",
        "Hem bottom edge to desired length",
        "Press all seams and finish raw edges",
      ],
      materials: [
        `${formData.fabric} fabric - 2.5 yards`,
        "Thread - matching color",
        "Interfacing - lightweight",
        "Zipper - 22 inch invisible",
        "Buttons - 6 pieces",
        "Bias tape - 1 yard",
      ],
    };

    setGeneratedPatterns((prev) => [newPattern, ...prev]);
    setGenerationsUsed((prev) => prev + 1);
    setIsGenerating(false);
  };

  const isAtLimit = currentPlan === "free" && generationsUsed >= 5;

  return (
    <div className="p-6 space-y-6">
      {/* Usage indicator for free plan */}
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

      {/* Pattern Library */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaImage className="h-5 w-5" />
            Pattern Library
            {currentPlan === "free" && (
              <Badge
                className="text-orange-600 border-orange-600 border py-2 px-6 rounded-md"
              >
                Limited on Free
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Browse and use patterns from your collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              {
                name: "A-Line Dress",
                category: "Dress",
                uses: 12,
                premium: false,
              },
              {
                name: "Blazer Classic",
                category: "Jacket",
                uses: 8,
                premium: true,
              },
              {
                name: "Pencil Skirt",
                category: "Skirt",
                uses: 15,
                premium: false,
              },
              {
                name: "Button Shirt",
                category: "Shirt",
                uses: 20,
                premium: false,
              },
              {
                name: "Wide Leg Pants",
                category: "Pants",
                uses: 6,
                premium: true,
              },
              { name: "Wrap Dress", category: "Dress", uses: 9, premium: true },
            ].map((pattern) => (
              <div
                key={pattern.name}
                className="text-center group cursor-pointer relative"
              >
                <div
                  className={`w-full h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-2 flex items-center justify-center group-hover:shadow-md transition-shadow ${
                    pattern.premium && currentPlan === "free"
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  <FaPalette className="h-6 w-6 text-purple-600" />
                  {pattern.premium && currentPlan === "free" && (
                    <FaLock className="absolute top-1 right-1 h-4 w-4 text-gray-500 bg-white rounded-full p-0.5" />
                  )}
                </div>
                <p className="text-sm font-medium truncate">{pattern.name}</p>
                <p className="text-xs text-gray-500">{pattern.category}</p>
                <Badge className="border border-gray-300 py-2 px-6 rounded-md text-xs mt-1">
                  {pattern.uses} uses
                </Badge>
                {pattern.premium && currentPlan === "free" && (
                  <Badge
                    className="text-xs mt-1 text-purple-600 border py-2 px-6 rounded-md border-purple-600"
                  >
                    Premium
                  </Badge>
                )}
              </div>
            ))}
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
                Describe your desired pattern and let AI create it for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="garmentType">Garment Type</Label>
                <Select
                  value={formData.garmentType}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, garmentType: value })
                  }
                  disabled={isAtLimit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select garment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dress">Dress</SelectItem>
                    <SelectItem value="blouse">Blouse</SelectItem>
                    <SelectItem value="skirt">Skirt</SelectItem>
                    <SelectItem value="pants">Pants</SelectItem>
                    <SelectItem value="jacket">Jacket</SelectItem>
                    <SelectItem value="coat">Coat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Select
                  value={formData.style}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, style: value })
                  }
                  disabled={isAtLimit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="vintage">Vintage</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="bohemian">Bohemian</SelectItem>
                    <SelectItem value="minimalist">Minimalist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Size Range</Label>
                <Select
                  value={formData.size}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, size: value })
                  }
                  disabled={isAtLimit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xs-s">XS-S</SelectItem>
                    <SelectItem value="m-l">M-L</SelectItem>
                    <SelectItem value="xl-xxl">XL-XXL</SelectItem>
                    <SelectItem value="all-sizes">All Sizes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fabric">Fabric Type</Label>
                <Select
                  value={formData.fabric}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, fabric: value })
                  }
                  disabled={isAtLimit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fabric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cotton">Cotton</SelectItem>
                    <SelectItem value="silk">Silk</SelectItem>
                    <SelectItem value="wool">Wool</SelectItem>
                    <SelectItem value="linen">Linen</SelectItem>
                    <SelectItem value="polyester">Polyester</SelectItem>
                    <SelectItem value="chiffon">Chiffon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occasion">Occasion</Label>
                <Input
                  id="occasion"
                  placeholder="e.g., wedding, office, casual wear"
                  value={formData.occasion}
                  onChange={(e: any) =>
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
                  onChange={(e: any) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  disabled={isAtLimit}
                />
              </div>

              <Button
                onClick={generatePattern}
                disabled={
                  isGenerating ||
                  !formData.garmentType ||
                  !formData.style ||
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

        {/* Generated Patterns */}
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

            {generatedPatterns.map((pattern) => (
              <Card key={pattern.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{pattern.name}</CardTitle>
                      <CardDescription>{pattern.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge>{pattern.style}</Badge>
                      <Badge className="border border-gray-300 py-2 px-6 rounded-md">{pattern.difficulty}</Badge>
                      {currentPlan === "free" && (
                        <Badge
                          className="border border-gray-300 py-2 px-6 rounded-md text-orange-600 border-orange-600"
                        >
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
                        src={pattern.imageUrl || "/placeholder.svg"}
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
                    <Button>
                      <FaSave className="h-4 w-4 mr-2" />
                      Save Pattern
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

            {generatedPatterns.length === 0 && !isGenerating && !isAtLimit && (
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
    </div>
  );
}
