import { FaLock, FaCrown } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import Button from "./ui/Button";

interface PlanRestrictionsProps {
  feature: string;
  currentPlan: "free" | "premium" | "enterprise";
  requiredPlan: "premium" | "enterprise";
  description: string;
  upgradeMessage: string;
}

export function PlanRestrictions({
  feature,
  currentPlan,
  requiredPlan,
  description,
  upgradeMessage,
}: PlanRestrictionsProps) {
  const isLocked = currentPlan === "free";

  if (!isLocked) {
    return null; // Don't render if the user has access
  }

  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <FaLock className="h-5 w-5" />
          Feature Locked
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-purple-700">
          <span className="font-semibold">{feature}</span> is a premium feature.
          {description}
        </p>
        <div className="flex items-center gap-4 p-4 border rounded-md border-purple-300 bg-purple-100">
          <FaCrown className="h-6 w-6 text-purple-600" />
          <div>
            <p className="font-medium text-purple-900">{upgradeMessage}</p>
            <p className="text-sm text-purple-800">
              Upgrade to the **{requiredPlan}** plan to unlock this and other
              features.
            </p>
          </div>
        </div>
        <Button className="w-full bg-purple-600 hover:bg-purple-700">
          Upgrade Plan
        </Button>
      </CardContent>
    </Card>
  );
}
