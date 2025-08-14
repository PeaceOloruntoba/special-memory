// src/pages/designer/SubscribePage.tsx
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "react-router";
import CheckoutForm from "../../components/stripe/CheckoutForm"; // You'll need to create this component
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { BiDollarCircle } from "react-icons/bi";
import { useMemo } from "react";
import { toTitleCase } from "../../lib/utils";

// Load Stripe.js with your publishable key.
// Replace 'your_stripe_publishable_key' with your actual key
const stripePromise = loadStripe(
  "pk_test_51RvUgcRpcgBDjLSAQW2JhJ3EoU8EqqYJHFBSygUeC9rGi9KuF9Rc68n4tD1iZk1tcGCCBs4bSo5aRN12M6Tb9JjL00DVX0PiNp"
);

export default function SubscribePage() {
  const [searchParams] = useSearchParams();
  const planName = searchParams.get("plan");

  const formattedPlanName = useMemo(() => {
    return planName ? toTitleCase(planName) : "Plan";
  }, [planName]);

  if (!planName) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold text-red-500">No plan specified.</h1>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <Card className="max-w-xl w-full">
        <CardHeader className="text-center">
          <BiDollarCircle className="mx-auto h-16 w-16 text-purple-600 mb-4" />
          <CardTitle className="text-2xl font-bold">
            Subscribe to the {formattedPlanName} Plan
          </CardTitle>
          <p className="text-gray-600">
            You are one step away from unlocking all features.
          </p>
        </CardHeader>
        <CardContent>
          {/* This is where your Stripe payment form will go */}
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              Please enter your payment details below to complete your
              subscription for the{" "}
              <span className="font-semibold">{formattedPlanName}</span> plan.
            </p>
            {/* The CheckoutForm component will be wrapped in Elements */}
            <Elements stripe={stripePromise}>
              {/* This component will contain the actual Stripe Card Element */}
              <CheckoutForm plan={planName} />
            </Elements>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
