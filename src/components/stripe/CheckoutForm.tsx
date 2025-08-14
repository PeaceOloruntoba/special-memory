import React, { useState } from "react";
import {
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import Button from "../ui/Button"; // Assuming you have a Button component
import { BiLoaderAlt } from "react-icons/bi";
import { toast } from "sonner";
import usePricingStore from "../../store/usePricingStore";
import { useNavigate } from "react-router";
import { toTitleCase } from "../../lib/utils";

interface CheckoutFormProps {
  plan: string; // The plan the user is subscribing to (e.g., "premium", "enterprise")
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ plan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { subscribeToPlan } = usePricingStore();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setLoading(false);
      return;
    }

    try {
      // Create a PaymentMethod. For this example, we're using CardElement.
      // In a real application, you might use PaymentElement.
      const cardElement = elements.getElement(CardElement);
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement!,
      });

      if (error) {
        setErrorMessage(error.message || "An unknown error occurred.");
        toast.error(error.message || "Payment method creation failed.");
        setLoading(false);
        return;
      }

      // Call your backend to complete the subscription
      // In a real application, your backend would create a Stripe Subscription
      // and handle the payment confirmation.
      await subscribeToPlan(plan, paymentMethod?.id);

      toast.success("Subscription successful! Redirecting...");
      navigate("/pricing"); // Redirect to pricing page or dashboard on success
    } catch (err: any) {
      console.error("Payment submission error:", err);
      setErrorMessage(
        err.message || "An unexpected error occurred during subscription."
      );
      toast.error(err.message || "Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-md shadow-sm bg-white">
        {/*
          Using CardElement for simplicity. For more robust UI and payment methods,
          consider using <PaymentElement /> and setting up a Payment Intent on your backend.
        */}
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>

      {errorMessage && (
        <div className="text-red-500 text-sm text-center">{errorMessage}</div>
      )}

      <Button
        type="submit"
        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
        disabled={!stripe || loading}
      >
        {loading ? (
          <BiLoaderAlt className="animate-spin mr-2" />
        ) : (
          `Confirm Subscription for ${toTitleCase(plan)}` // Using toTitleCase here too
        )}
      </Button>
    </form>
  );
};

export default CheckoutForm;
